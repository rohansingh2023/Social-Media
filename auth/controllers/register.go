package controllers

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/rohan/auth/helpers"
	"github.com/rohan/auth/models"
	service "github.com/rohan/auth/services"
	"github.com/rohan/auth/utils"
)

func RegisterUser(c *gin.Context){
	client , errio := helpers.GetMongoClient(c)
	if errio{
        return
    }

    var input models.RegisterInput

    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    newUser, err := helpers.MakeRegisterCallAsync(c, input, client, ctx)
    if err != nil{
        return
    }

    // Clear Redis cache
    err = service.SetupRedisInstance().FlushAll(ctx).Err()
    if err != nil {
        log.Printf("Error flushing Redis cache: %v", err)
    }

    // Generate Refresh Token
    refreshToken, err := utils.GenerateRefreshToken(newUser.ID.String())
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error generating refresh token"})
        return
    }

    // Generate JWT token
    token, err := utils.GenerateAccessToken(newUser.ID.String())
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error generating access token"})
        return
    }

    c.JSON(http.StatusCreated, gin.H{
        "token":   token,
        "refresh-token": refreshToken,
        "message": "Registered user successfully",
    })
}