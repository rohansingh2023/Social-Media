package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/rohan/auth/utils"
)

func ValidateRequest(c *gin.Context) {
	token := c.GetHeader("Authorization")
	if token == ""{
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing Auth Header"})
        c.Abort()
        return
	}
	_ , err := utils.ValidateAccessToken(token)
	if err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid access token"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Request is Authorized"})
}
