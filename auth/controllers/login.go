package controllers

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/rohan/auth/helpers"
	"github.com/rohan/auth/utils"
	"golang.org/x/crypto/bcrypt"
)

func LoginUser(c *gin.Context){
	logger := utils.NewCustomLogger()
	clientOrigin := c.GetHeader("Origin")
	sourceURL := c.Request.RequestURI
	if clientOrigin != "" {
		sourceURL = clientOrigin + sourceURL
	}
	logger.Log("INFO", "1832eh2238ey289", "Auth", "Incoming Request from: ", utils.LogOptions{
		SourceURL: &sourceURL,
	})
	targetUrl := c.Request.URL.Scheme + "://" + c.Request.Host + c.Request.RequestURI
	logger.Log("INFO", "1832eh2238ey289", "Auth", "Incoming Request to: ", utils.LogOptions{
		TargetURL: &targetUrl,
	})
	
	client, redis , erro := helpers.GetMongoRedisClient(c, logger)
	if erro {
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	user, err, input := helpers.MakeLoginCallAsync(c, logger, client, ctx)
	if err != nil{
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password))
	if err != nil {
		statusCode := http.StatusUnauthorized
		logger.Log("ERROR", "1832eh2238ey289", "Auth", "Passwords do not match", utils.LogOptions{
			StatusCode: &statusCode,
		})
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Passwords do not match"})
		return
	}

	token , err := helpers.GenJWTTokenAndSaveSession(c, logger, user)
	if err != nil{
		return
	}

	refreshToken, err := helpers.GenRefreshTokenAndSaveToCache(c, logger, user, redis, ctx)
	if err != nil{
		return
	}

	statusCode := http.StatusOK
	logger.Log("DEBUG", "1832eh2238ey289", "Auth", "User Logged In Successfully", utils.LogOptions{
		StatusCode: &statusCode,
	})
	c.JSON(http.StatusOK, gin.H{
		"access_token":   token,
		"refresh_token": refreshToken,
		"message": "Logged in successfully",
		"user": gin.H{
			"id":    user.ID.Hex(),
			"name":  user.Name,
			"email": user.Email,
			"photo": user.ProfilePic,
		},
	})
}