package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Conversation struct {
	ID      primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Members []string           `bson:"members" json:"members"`
}
