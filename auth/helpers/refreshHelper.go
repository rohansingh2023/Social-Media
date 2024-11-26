package helpers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
	"github.com/rohan/auth/utils"
)

// Get redis variable
func GetRedisClient(c *gin.Context, logger *utils.CustomLogger) (*redis.Client, bool) {
	redisInterface, exists := c.Get("redis")
	if !exists {
		statusCode := http.StatusInternalServerError
		logger.Log("ERROR", "1832eh2238ey289", "Auth", "Redis client not found", utils.LogOptions{
			StatusCode: &statusCode,
		})
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Redis client not found"})
		return nil, true
	}

	// Type assertion to convert interface{} to *mongo.Client
	redis, ok := redisInterface.(*redis.Client)
	if !ok {
		statusCode := http.StatusInternalServerError
		logger.Log("ERROR", "1832eh2238ey289", "Auth", "Invalid Redis client type", utils.LogOptions{
			StatusCode: &statusCode,
		})
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid Redis client type"})
		return nil, true
	}
	return redis, false
}