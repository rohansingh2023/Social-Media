package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/rohan/chat-server-v2/controllers"
	"github.com/rohan/chat-server-v2/db"
	"github.com/rohan/chat-server-v2/middlewares"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	r := gin.Default()

	r.Use(middlewares.CORS())

	d := db.ConfigDatabase()

	r.Use(middlewares.GlobalVariables(d))

	r.GET("/", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{
			"data": "Test Successful",
		})
	})
	conv := r.Group("/api/conversation")
	{
		conv.POST("/", controllers.CreateConversation)
		conv.GET("/user/:userId", controllers.GetConversationOfAUser)
		conv.GET("/users/:firstUserId/:secondUserId", controllers.GetConversationOfTwoUsers)
	}

	msg := r.Group("/api/message")
	{
		msg.POST("/", controllers.AddMessage)
		msg.GET("/:conversationId", controllers.GetAMessage)
	}
	r.Run(":9090")
}
