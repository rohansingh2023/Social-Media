package helpers

import (
	"log"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
	"github.com/golang-jwt/jwt/v4"
	"github.com/rohan/auth/models"
	"github.com/rohan/auth/utils"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func AccessTokenRegenerate(c *gin.Context, redis *redis.Client, refreshString string, session sessions.Session) {
	err := utils.ValidateRefreshToken(c, redis, session.Get("userId").(string), refreshString)
	if !err {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Refresh Token not valid"})
		c.Abort()
		return
	}
	var user models.User
	user.ID = session.Get("userId").(primitive.ObjectID)
	user.Name = session.Get("name").(string)
	user.Email = session.Get("email").(string)
	user.ProfilePic = session.Get("photo").(string)
	newToken, erri := utils.GenerateJWTToken(user)
	if erri != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error generating token"})
		c.Abort()
		return
	}
	c.Header("Authorization", newToken)
	c.JSON(http.StatusOK, gin.H{"message": "New access token generated", "access_token": newToken})
}

func VerifyandParseAccessToken(c *gin.Context, access_token string, jwtSecret []byte) (string, error) {
	token, erro := jwt.Parse(access_token, func(token *jwt.Token) (interface{}, error) {
		// Ensure the signing method is correct
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.ErrSignatureInvalid
		}
		return jwtSecret, nil
	})
	if erro != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		c.Abort()
		return "", erro
	}
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		// Handle error
		log.Println("Could not extract claims")
		return "", nil
	}
	userID, ok := claims["id"].(string)
	if !ok {
		// Handle error: userID not found or not of expected type
		log.Println("userID not found or not a string")
		return "", nil
	}
	return userID, nil
}
