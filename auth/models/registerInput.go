package models

type RegisterInput struct {
	Name       string `json:"name" binding:"required"`
	Email      string `json:"email" binding:"required"`
	Password   string `json:"password" binding:"required"`
	ProfilePic string `json:"profilePic" binding:"required"`
	DOB        string `json:"dob"`
	Bio        string `json:"bio"`
}