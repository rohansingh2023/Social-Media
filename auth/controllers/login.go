package controllers

import (
	"context"
	"net/http"
	"strings"
	"time"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
	"github.com/rohan/auth/models"
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

	redisInterface, exists := c.Get("redis")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Redis client not found"})
		return
	}

	// Type assertion to convert interface{} to *mongo.Client
	redis, ok := redisInterface.(*redis.Client)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid Redis client type"})
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

	session:= sessions.Default(c)
	session.Set("jwt", token)
	session.Save()

	// Create a refresh token
	refreshToken, _ , err := utils.GenerateRefreshToken()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate refresh token"})
		return
	}


	// Set the Refresh token as an HTTP-only cookie
	http.SetCookie(c.Writer, &http.Cookie{
		Name: "refresh_token",
		Value: refreshToken,
		Path: "/",
		Expires: time.Now().Add(24 * time.Hour),
		HttpOnly: true,
		Secure: false,
		SameSite: http.SameSiteLaxMode,
	})

	// Optionally store the Refresh token in Redis session
	err = redis.SetEX(ctx, "refresh-token:"+ string(user.ID.Hex()), refreshToken, 24*time.Hour).Err()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error storing refresh token in Redis"})
		return
	}

	// Return the token and user details
	c.JSON(http.StatusOK, gin.H{
		"access-token":   token,
		"refresh-token": refreshToken,
		"message": "Logged in successfully",
		"user": gin.H{
			"id":    user.ID.Hex(),
			"name":  user.Name,
			"email": user.Email,
			"photo": user.ProfilePic,
		},
	})
}