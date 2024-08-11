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

func CreateConversation(ctx *gin.Context) {
	clientInterface, exists := ctx.Get("client")
	if !exists {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "MongoDB client not found"})
		return
	}

	// Type assertion to convert interface{} to *mongo.Client
	client, ok := clientInterface.(*mongo.Client)
	if !ok {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid MongoDB client type"})
		return
	}
	var reqBody struct {
		SenderId   string `bson:senderId`
		ReceiverId string `bson:receiverId`
	}

	err := ctx.BindJSON(&reqBody)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	newConversation := models.Conversation{Members: []string{reqBody.SenderId, reqBody.ReceiverId}}
	collection := client.Database("smChatDb").Collection("conversations")
	// c, cancel
	c, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	result, err := collection.InsertOne(c, newConversation)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, result)
}

func GetConversationOfAUser(ctx *gin.Context) {
	clientInterface, exists := ctx.Get("client")
	if !exists {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "MongoDB client not found"})
		return
	}

	// Type assertion to convert interface{} to *mongo.Client
	client, ok := clientInterface.(*mongo.Client)
	if !ok {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid MongoDB client type"})
		return
	}
	userId := ctx.Param("userId")
	c, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	collection := client.Database("smChatDb").Collection("conversations")
	filter := bson.M{"members": bson.M{"$in": []string{userId}}}
	cursor, err := collection.Find(c, filter)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer cursor.Close(c)
	var conversations []bson.M
	if err := cursor.All(ctx, &conversations); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Operation Successfull",
		"data":    conversations,
	})
}

func GetConversationOfTwoUsers(ctx *gin.Context) {
	clientInterface, exists := ctx.Get("client")
	if !exists {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "MongoDB client not found"})
		return
	}

	// Type assertion to convert interface{} to *mongo.Client
	client, ok := clientInterface.(*mongo.Client)
	if !ok {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid MongoDB client type"})
		return
	}
	firstUserId := ctx.Param("firstUserId")
	secondUserId := ctx.Param("secondUserId")
	c, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	collection := client.Database("smChatDb").Collection("conversations")
	filter := bson.M{"members": bson.M{"$all": []string{firstUserId, secondUserId}}}
	var conversation bson.M
	err := collection.FindOne(c, filter).Decode(&conversation)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "No conversation found"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, conversation)
}
