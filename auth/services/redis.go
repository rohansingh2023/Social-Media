package service

import "github.com/go-redis/redis/v8"

func SetupRedisInstance() *redis.Client {
	redisClient := redis.NewClient(&redis.Options{
		Addr: "localhost:6379", // Change as per your configuration

	})

	return redisClient
}
