package utils

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/golang-jwt/jwt/v4"
	"github.com/rohan/auth/models"
)

var jwtSecret = []byte(os.Getenv("JWT_SECRET_KEY"))

// Generate access token using JWT.
func GenerateAccessToken(userId string) (string, error) {
    expirationTime := time.Now().Add(15 * time.Minute)  // 15 min
    claims := &models.Claims{
        UserId: userId,
        StandardClaims: jwt.StandardClaims{
            ExpiresAt: expirationTime.Unix(),
        },
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString(jwtSecret)
}

// Generate refresh token using JWT.
func GenerateRefreshToken(userId string) (string, error) {
    expirationTime := time.Now().Add(7 * 24 * time.Hour) // 1 week
    claims := &models.Claims{
        UserId: userId,
        StandardClaims: jwt.StandardClaims{
            ExpiresAt: expirationTime.Unix(),
        },
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString(jwtSecret)
}

// Validate refresh token using secret key and redis cache.
func ValidateRefreshToken(tokenString string ,redis *redis.Client, ctx context.Context) (string, error) {
    claims := &models.Claims{}
    token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
        return jwtSecret, nil
    })

    if err != nil || !token.Valid {
        return "", err
    }

    userId := claims.UserId
    if userId != "" {
        storedRefToken, err := redis.Get(ctx, "refresh-token:" + userId).Result()
        fmt.Println("StorefRefToken: ", "refresh-token:" + userId)
        if err != nil {
            log.Println("Redis error:", err)
            return "", err
        }
        if storedRefToken == tokenString{
            fmt.Println("They are equal")
            return userId, nil
        }
    }
    return "", err
}

// Validate access token with the correct secret key.
func ValidateAccessToken(tokenString string) (*models.Claims, error) {
    claims := &models.Claims{}
    token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
        return jwtSecret, nil
    })

    if err != nil || !token.Valid {
        return nil, err
    }
    return claims, nil
}