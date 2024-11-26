package controllers

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/rohan/auth/helpers"
	"github.com/rohan/auth/utils"
)

func Refresh(c *gin.Context){
	logger := utils.NewCustomLogger()
	redis, erri := helpers.GetRedisClient(c, logger)
	if erri{
		return
	}
	cookie, err := c.Cookie("refresh_token")
	if err != nil{
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Refresh Token not found"})
		return
	}
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	userId, err := utils.ValidateRefreshToken(cookie, redis, ctx)
	if err != nil{
		c.JSON(http.StatusUnauthorized, gin.H{"error": err})
        return
	}
	accessToken, err := utils.GenerateAccessToken(userId)
	if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate access token"})
        return
    }
	c.Set("Authorization", accessToken)
    c.JSON(http.StatusOK, gin.H{"message": "Access Token renewed"})
}