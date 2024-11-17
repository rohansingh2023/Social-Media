package controllers

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
	"github.com/golang-jwt/jwt/v4"
	"github.com/rohan/auth/utils"
)

var jwtSecret = []byte(os.Getenv("JWT_SECRET_KEY"))

// -------------> IN PROGRESS <------------------- //
func ValidateRequest(c *gin.Context) {
	// 1: Take Redis variables
	redisInterface, err := c.Get("redis")
	if !err {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Redis client not found"})
		return
	}
	redis, ok := redisInterface.(*redis.Client)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid Redis client type"})
		return
	}

	// 2: Check if access and refresh token are not null
	access_token := c.GetHeader("Authorization")
	refreshToken, erro := c.Cookie("refresh_token")
	if erro != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Refresh token not found"})
		return
	}
	if access_token == "" || refreshToken == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Tokens not found"})
		return
	}

	// 4: Verify access and refresh token
	token, erro := jwt.Parse(access_token, func(token *jwt.Token) (interface{}, error) {
		// Ensure the signing method is correct
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.ErrSignatureInvalid
		}
		return jwtSecret, nil
	})
	if erro != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		c.Abort()
		return
	}
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		// Handle error
		log.Println("Could not extract claims")
		return
	}
	userID, ok := claims["id"].(string)
	if !ok {
		// Handle error: userID not found or not of expected type
		log.Println("userID not found or not a string")
		return
	}
	errio := utils.ValidateRefreshToken(c, redis, userID, refreshToken)
	if !errio {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Refresh Token not valid"})
	}
	c.JSON(http.StatusOK, gin.H{"message": "Request is authorized"})
}
