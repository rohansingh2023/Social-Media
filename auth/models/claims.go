package models

import "github.com/golang-jwt/jwt/v4"

type Claims struct {
	UserId string `json:"UserId"`
	jwt.StandardClaims
}