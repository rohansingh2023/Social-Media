package utils

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"log"
	"os"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/golang-jwt/jwt/v4"
	"github.com/rohan/auth/models"
	"golang.org/x/crypto/bcrypt"
)

var jwtSecret = []byte(os.Getenv("JWT_SECRET_KEY"))

func GenerateJWTToken(user models.User) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":    user.ID.Hex(),
        "name":  user.Name,
        "email": user.Email,
        "photo": user.ProfilePic,
        "exp":   time.Now().Add(24 * time.Minute).Unix(),
	})

	return token.SignedString(jwtSecret)
}

func GenerateRefreshToken()(string, string, error){
	randomBytes := make([]byte, 32)
	if _, err := rand.Read(randomBytes); err != nil {
		return "", "", err
	}
	token := base64.URLEncoding.EncodeToString(randomBytes)
	hashedToken, err := bcrypt.GenerateFromPassword([]byte(token), bcrypt.DefaultCost)
	if err != nil {
		return "", "", err
	}
	return token, string(hashedToken), nil
}

func SaveRefreshTokenToCache(ctx context.Context, redisClient *redis.Client, userID int, token string)error{
	ttl := 7*24*time.Hour  // 7 days
	err := redisClient.SetEX(ctx, "refresh-token:" + string(userID), token, ttl).Err()
	if err != nil {
		return err
	}
	return nil
}

func ValidateRefreshToken(ctx context.Context, redisClient *redis.Client, userID string, refreshString string)bool{
	storedRefToken, err := redisClient.Get(ctx, "refresh-token:" + userID).Result()
	if err != nil {
		log.Println("Redis error:", err)
		return false
	}
	if storedRefToken == refreshString{
		return true
	}
	return false
}