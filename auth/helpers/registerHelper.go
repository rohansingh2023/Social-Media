package helpers

import (
	"context"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/gin-gonic/gin"
	"github.com/rohan/auth/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

// Get mongo variable.
func GetMongoClient(c *gin.Context)(*mongo.Client, bool){
	clientInterface, exists := c.Get("client")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "MongoDB client not found"})
		return nil, true
	}

	// Type assertion to convert interface{} to *mongo.Client
	client, ok := clientInterface.(*mongo.Client)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid MongoDB client type"})
		return nil, true
	}
	return client, false
}

// Make DB call to register a user.
func MakeRegisterCallAsync(c *gin.Context, input models.RegisterInput, client *mongo.Client, ctx context.Context) (models.User, error){
    var existingUser models.User
	collection := client.Database("graphqlSmDB").Collection("users")
    err := collection.FindOne(ctx, bson.M{"email": input.Email}).Decode(&existingUser)
    if err == nil {
        c.JSON(http.StatusConflict, gin.H{"error": "User already exists. Try with a different emailId"})
        return models.User{}, err
    }

    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error hashing password"})
        return models.User{}, err
    }

	uploadResult, err := StoreMediaOnCloud(c, input, ctx)
	if err != nil{
		return models.User{}, err
	}

    newUser := models.User{
        ID:         primitive.NewObjectID(),
        Name:       input.Name,
        Email:      input.Email,
        Password:   string(hashedPassword),
        ProfilePic: uploadResult.URL,
        DOB:        input.DOB,
        Bio:        input.Bio,
        CreatedAt:  time.Now(),
        UpdatedAt:  time.Now(),
    }

    _, err = collection.InsertOne(ctx, newUser)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating user"})
        return models.User{}, err
    }
	return newUser, nil
}

// Store media files like photo, video, etc on cloud.
func StoreMediaOnCloud(c *gin.Context, input models.RegisterInput, ctx context.Context)(*uploader.UploadResult, error){
	cld, _ := cloudinary.NewFromParams(os.Getenv("CLOUD_NAME"), os.Getenv("CLOUD_API_KEY"), os.Getenv("CLOUD_API_SECRET"))

    uploadResult, err := cld.Upload.Upload(ctx, input.ProfilePic, uploader.UploadParams{})
    if err != nil {
        log.Fatal(err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error uploading profile picture"})
        return &uploader.UploadResult{}, err
    }
	return uploadResult, nil
}