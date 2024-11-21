package helpers

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
)

func GetMongoRedisClient(c *gin.Context, logger *utils.CustomLogger) (*mongo.Client, *redis.Client, bool){
	clientInterface, exists := c.Get("client")
	if !exists {
		statusCode := http.StatusInternalServerError
		logger.Log("ERROR", "1832eh2238ey289", "Auth", "MongoDB client not found", utils.LogOptions{
			StatusCode: &statusCode,
		})
		c.JSON(http.StatusInternalServerError, gin.H{"error": "MongoDB client not found"})
		return nil, nil, true
	}

	// Type assertion to convert interface{} to *mongo.Client
	client, ok := clientInterface.(*mongo.Client)
	if !ok {
		statusCode := http.StatusInternalServerError
		logger.Log("ERROR", "1832eh2238ey289", "Auth", "Invalid MongoDB client type", utils.LogOptions{
			StatusCode: &statusCode,
		})
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid MongoDB client type"})
		return nil, nil, true
	}

	redisInterface, exists := c.Get("redis")
	if !exists {
		statusCode := http.StatusInternalServerError
		logger.Log("ERROR", "1832eh2238ey289", "Auth", "Redis client not found", utils.LogOptions{
			StatusCode: &statusCode,
		})
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Redis client not found"})
		return nil, nil, true
	}

	// Type assertion to convert interface{} to *mongo.Client
	redis, ok := redisInterface.(*redis.Client)
	if !ok {
		statusCode := http.StatusInternalServerError
		logger.Log("ERROR", "1832eh2238ey289", "Auth", "Invalid Redis client type", utils.LogOptions{
			StatusCode: &statusCode,
		})
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid Redis client type"})
		return nil, nil, true
	}

	return client, redis, false
}


func MakeLoginCallAsync(c *gin.Context, logger *utils.CustomLogger, client *mongo.Client, ctx context.Context) (models.User, error, models.LoginInput){
	var input models.LoginInput
	// Bind the request JSON to the input struct
	if err := c.ShouldBindJSON(&input); err != nil {
		statusCode := http.StatusBadRequest
		logger.Log("ERROR", "1832eh2238ey289", "Auth", err.Error(), utils.LogOptions{
			StatusCode: &statusCode,
		})
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return models.User{}, err, models.LoginInput{}
	}

	// Normalize the email (lowercase and trim)
	email := input.Email
	email = strings.TrimSpace(strings.ToLower(email))

	// Find user by email in MongoDB
	var user models.User
	collection := client.Database("graphqlSmDB").Collection("users")
	err := collection.FindOne(ctx, bson.M{"email": email}).Decode(&user)
	if err == mongo.ErrNoDocuments {
		statusCode := http.StatusUnauthorized
		logger.Log("ERROR", "1832eh2238ey289", "Auth", "User doesn't exist", utils.LogOptions{
			StatusCode: &statusCode,
		})
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User doesn't exist"})
		return models.User{}, err, models.LoginInput{}
	} else if err != nil {
		statusCode := http.StatusInternalServerError
		logger.Log("ERROR", "1832eh2238ey289", "Auth", "Error finding user", utils.LogOptions{
			StatusCode: &statusCode,
		})
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error finding user"})
		return models.User{}, err, models.LoginInput{}
	}
	return user, nil, input
}

func GenJWTTokenAndSaveSession(c *gin.Context, logger *utils.CustomLogger, user models.User) (string, error){
	token, err := utils.GenerateJWTToken(user)
	if err != nil {
		statusCode := http.StatusInternalServerError
		logger.Log("ERROR", "1832eh2238ey289", "Auth", "Error generating token", utils.LogOptions{
			StatusCode: &statusCode,
		})
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error generating token"})
		return "", err
	}
	session:= sessions.Default(c)
	session.Set("jwt", token)
	session.Set("userId", user.ID.Hex())
	session.Set("name", user.Name)
	session.Set("email", user.Email)
	session.Set("photo", user.ProfilePic)
	session.Save()

	return token , nil
}

func GenRefreshTokenAndSaveToCache(c *gin.Context, logger *utils.CustomLogger, user models.User, redis *redis.Client, ctx context.Context)(string, error){
	refreshToken, _ , err := utils.GenerateRefreshToken()
	if err != nil {
		statusCode := http.StatusInternalServerError
		logger.Log("ERROR", "1832eh2238ey289", "Auth", "Could not generate refresh token", utils.LogOptions{
			StatusCode: &statusCode,
		})
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate refresh token"})
		return "", err
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
		statusCode := http.StatusInternalServerError
		logger.Log("ERROR", "1832eh2238ey289", "Auth", "Error storing refresh token in Redis", utils.LogOptions{
			StatusCode: &statusCode,
		})
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error storing refresh token in Redis"})
		return "", err
	}

	return refreshToken, nil
}