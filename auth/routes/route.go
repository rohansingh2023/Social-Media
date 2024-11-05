package routes

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/rohan/auth/controllers"
	"github.com/rohan/auth/middlewares"
	service "github.com/rohan/auth/services"
)

func SetupRouter() *gin.Engine {
    err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}
    
    router := gin.Default()
    router.Use(middlewares.CORS())
    d := service.ConfigDatabase()
    router.Use(middlewares.GlobalDBVariables(d))

    // Define routes
    router.GET("/", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{
            "data": "Init successfull",
        })
    })
    router.POST("/register", controllers.RegisterUser)
    router.POST("/login", controllers.LoginUser)

    return router
}