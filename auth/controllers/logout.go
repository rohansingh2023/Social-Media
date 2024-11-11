package controllers

import (
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
)

func LogoutUser(c *gin.Context){
	session := sessions.Default(c)
	session.Delete("jwt")
	if err := session.Save(); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save session changes"})
        return
    }
	redisInterface, exists := c.Get("redis")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Redis client not found"})
		return
	}

	// Type assertion to convert interface{} to *redis.Client
	redis, ok := redisInterface.(*redis.Client)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid Redis client type"})
		return
	}

	var cursor uint64
    var keys []string
    var err error

    for {
        // SCAN command to find matching keys with the pattern "refresh-token*"
        keys, cursor, err = redis.Scan(c, cursor, "refresh-token*", 0).Result()
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan Redis"})
            return
        }

        // If there are keys matching the pattern, delete them
        if len(keys) > 0 {
            err = redis.Del(c, keys...).Err()
            if err != nil {
                c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete keys"})
                return
            }
        }

        // If cursor is 0, the scan is complete
        if cursor == 0 {
            break
        }
    }

	c.JSON(200, gin.H{"message": "User Logged out successfully"})
}