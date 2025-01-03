package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/rohan/auth/utils"
)

func ValidateRequest(c *gin.Context) {
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
	token := c.GetHeader("Authorization")
	if token == ""{
		statusCode := http.StatusUnauthorized
		logger.Log("ERROR", "1832eh2238ey289", "Auth", "Missing Auth Header", utils.LogOptions{
			StatusCode: &statusCode,
		})
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing Auth Header"})
        c.Abort()
        return
	}
	_ , err := utils.ValidateAccessToken(token)
	if err != nil {
		statusCode := http.StatusUnauthorized
		logger.Log("ERROR", "1832eh2238ey289", "Auth", "Invalid access token", utils.LogOptions{
			StatusCode: &statusCode,
		})
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid access token"})
        return
    }
	statusCode := http.StatusOK
	logger.Log("DEBUG", "1832eh2238ey289", "Auth", "Request is Authorized", utils.LogOptions{
		StatusCode: &statusCode,
	})
    c.JSON(http.StatusOK, gin.H{"message": "Request is Authorized"})
}
