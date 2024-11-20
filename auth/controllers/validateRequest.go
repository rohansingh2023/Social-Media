package controllers

import (
	"net/http"
	"os"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
	"github.com/rohan/auth/helpers"
	"github.com/rohan/auth/utils"
)

var jwtSecret = []byte(os.Getenv("JWT_SECRET_KEY"))

// -------------> IN PROGRESS <------------------- //
func ValidateRequest(c *gin.Context) {
	// 1: Take Redis and Session variables
	session := sessions.Default(c)
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
		c.Abort()
		return
	}
	if access_token == "" {
		helpers.AccessTokenRegenerate(c, redis, refreshToken, session)
		return
	}

	// 4: Verify access and refresh token
	userID, erro := helpers.VerifyandParseAccessToken(c, access_token, jwtSecret)
	if erro != nil{
		return
	}
	errio := utils.ValidateRefreshToken(c, redis, userID, refreshToken)
	if !errio {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Refresh Token not valid"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Request is authorized"})
}
