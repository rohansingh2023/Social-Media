package controllers

import (
	"context"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/rohan/auth/models"
	service "github.com/rohan/auth/services"
	"github.com/rohan/auth/utils"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

func LoginUser(c *gin.Context){
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
		Email    string `json:"email" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	// Bind the request JSON to the input struct
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Normalize the email (lowercase and trim)
	email := input.Email
	email = strings.TrimSpace(strings.ToLower(email))

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Find user by email in MongoDB
	var user models.User
	collection := client.Database("graphqlSmDB").Collection("users")
	err := collection.FindOne(ctx, bson.M{"email": email}).Decode(&user)
	if err == mongo.ErrNoDocuments {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User doesn't exist"})
		return
	} else if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error finding user"})
		return
	}

	// Compare the hashed password with the input password
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Passwords do not match"})
		return
	}

	// Create a JWT token for the user
	token, err := utils.GenerateJWTToken(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error generating token"})
		return
	}

	// Optionally store the JWT token in Redis session
	err = service.SetupRedisInstance().Set(ctx, user.ID.Hex(), token, 24*time.Hour).Err()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error setting session in Redis"})
		return
	}

	// Return the token and user details
	c.JSON(http.StatusOK, gin.H{
		"token":   token,
		"message": "Logged in successfully",
		"user": gin.H{
			"id":    user.ID.Hex(),
			"name":  user.Name,
			"email": user.Email,
			"photo": user.ProfilePic,
		},
	})
}