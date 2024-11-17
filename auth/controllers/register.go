package controllers

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
	service "github.com/rohan/auth/services"
	"github.com/rohan/auth/utils"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

func RegisterUser(c *gin.Context){
	clientInterface, exists := c.Get("client")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "MongoDB client not found"})
		return
	}

	// Type assertion to convert interface{} to *mongo.Client
	client, ok := clientInterface.(*mongo.Client)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid MongoDB client type"})
		return
	}
	var input struct {
        Name       string `json:"name" binding:"required"`
        Email      string `json:"email" binding:"required"`
        Password   string `json:"password" binding:"required"`
        ProfilePic string `json:"profilePic" binding:"required"`
        DOB        string `json:"dob"`
        Bio        string `json:"bio"`
    }

    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    // Check if user exists
    var existingUser models.User
	collection := client.Database("graphqlSmDB").Collection("users")
    err := collection.FindOne(ctx, bson.M{"email": input.Email}).Decode(&existingUser)
    if err == nil {
        c.JSON(http.StatusConflict, gin.H{"error": "User already exists. Try with a different emailId"})
        return
    }

    // Hash the password
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error hashing password"})
        return
    }

    // Upload profile picture to Cloudinary
    cld, _ := cloudinary.NewFromParams(os.Getenv("CLOUD_NAME"), os.Getenv("CLOUD_API_KEY"), os.Getenv("CLOUD_API_SECRET"))

    uploadResult, err := cld.Upload.Upload(ctx, input.ProfilePic, uploader.UploadParams{})
    if err != nil {
        log.Fatal(err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error uploading profile picture"})
        return
    }

    // Create a new user object
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

    // Insert user into MongoDB
    _, err = collection.InsertOne(ctx, newUser)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating user"})
        return
    }

    // Clear Redis cache
    err = service.SetupRedisInstance().FlushAll(ctx).Err()
    if err != nil {
        log.Printf("Error flushing Redis cache: %v", err)
    }

    // Generate JWT token
    token, err := utils.GenerateJWTToken(newUser)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error generating token"})
        return
    }

    c.JSON(http.StatusCreated, gin.H{
        "token":   token,
        "message": "Registered user successfully",
    })
}