package controllers

import (
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

func TestProfile(c *gin.Context){
	session := sessions.Default(c)
	token := session.Get("jwt")
	// token := c.GetHeader("Authorization")
	if token == nil{
		c.JSON(401, gin.H{"error": "unauthorized"})
		return
	}
	c.JSON(200, gin.H{"access-token": token})
} 