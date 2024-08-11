package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Message struct {
	ID             primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	ConversationId string             `bson:"conversationId" json:"conversationId"`
	Sender         string             `bson:"sender" json:"sender"`
	Text           string             `bson:"text" json:"text"`
	CreatedAt      time.Time          `json:"createdAt" bson:"createdAt"`
}
