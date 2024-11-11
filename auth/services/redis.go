package service

import (
	"log"

	"github.com/go-redis/redis/v8"
)

func SetupRedisInstance() *redis.Client {
	redisClient := redis.NewClient(&redis.Options{
		Addr: "localhost:6379", // Change as per your configuration

	})
	log.Println("Connected to Redis!")
	return redisClient
}
