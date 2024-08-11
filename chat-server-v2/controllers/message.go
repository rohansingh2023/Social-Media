package controllers

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/rohan/chat-server-v2/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func AddMessage(ctx *gin.Context) {
	clientInterface, exists := ctx.Get("client")
	if !exists {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "MongoDB client not found"})
		return
	}

	client, ok := clientInterface.(*mongo.Client)
	if !ok {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid MongoDB client type"})
		return
	}
	var newMessage models.Message
	if err := ctx.BindJSON(&newMessage); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	collection := client.Database("smChatDb").Collection("messages")

	result, err := collection.InsertOne(c, newMessage)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, result)
}

func GetAMessage(ctx *gin.Context) {
	clientInterface, exists := ctx.Get("client")
	if !exists {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "MongoDB client not found"})
		return
	}

	client, ok := clientInterface.(*mongo.Client)
	if !ok {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid MongoDB client type"})
		return
	}
	conversationId := ctx.Param("conversationId")
	c, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	collection := client.Database("smChatDb").Collection("messages")

	filter := bson.M{"conversationId": conversationId}

	cursor, err := collection.Find(c, filter)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer cursor.Close(ctx)

	var messages []models.Message
	if err := cursor.All(ctx, &messages); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, messages)
}
