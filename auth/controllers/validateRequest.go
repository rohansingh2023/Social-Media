package controllers

import (
	"net/http"
	"os"

	// "github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
	"github.com/golang-jwt/jwt/v4"
	"github.com/rohan/auth/utils"
)

var jwtSecret = []byte(os.Getenv("JWT_SECRET_KEY"))

// -------------> IN PROGRESS <------------------- //
func ValidateRequest(c *gin.Context){
	// 1: Take Redis and session variables
	// session := sessions.Default(c)
	redisInterface, err := c.Get("redis")
	if !err{
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
	if access_token == "" || refreshToken == ""{
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
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		// Pass claims to the context for use in handlers
		c.Set("userID", claims["id"])
		c.Set("userName", claims["name"])
		c.Set("userEmail", claims["email"])
		c.Set("userPhoto", claims["photo"])
	} else {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
		c.Abort()
		return
	}
	err = utils.ValidateRefreshToken(c, redis, 1223, refreshToken)
	if err{
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Refresh Token not valid"})
	}

	c.JSON(http.StatusOK, gin.H{"message": "Request is authorized"})
}