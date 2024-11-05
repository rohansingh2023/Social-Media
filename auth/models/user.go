package models

import (
    "time"
    "go.mongodb.org/mongo-driver/bson/primitive"
)

type Friend struct {
    UserID     string `bson:"userId,omitempty" json:"userId,omitempty"`
    Name       string `bson:"name,omitempty" json:"name,omitempty"`
    Email      string `bson:"email,omitempty" json:"email,omitempty"`
    ProfilePic string `bson:"profilePic,omitempty" json:"profilePic,omitempty"`
    CreatedAt  string `bson:"createdAt,omitempty" json:"createdAt,omitempty"`
}

type User struct {
    ID            primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
    Name          string             `bson:"name,omitempty" json:"name,omitempty" validate:"required"`
    Email         string             `bson:"email,omitempty" json:"email,omitempty" validate:"required,email"`
    Password      string             `bson:"password,omitempty" json:"password,omitempty" validate:"required"`
    ProfilePic    string             `bson:"profilePic,omitempty" json:"profilePic,omitempty"`
    DOB           string             `bson:"dob,omitempty" json:"dob,omitempty"`
    Bio           string             `bson:"bio,omitempty" json:"bio,omitempty"`
    FriendRequests []Friend          `bson:"friendRequests,omitempty" json:"friendRequests,omitempty"`
    Friends       []Friend           `bson:"friends,omitempty" json:"friends,omitempty"`
    CreatedAt     time.Time          `bson:"createdAt,omitempty" json:"createdAt,omitempty"`
    UpdatedAt     time.Time          `bson:"updatedAt,omitempty" json:"updatedAt,omitempty"`
}
