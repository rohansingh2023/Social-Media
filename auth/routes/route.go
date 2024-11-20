package routes

import (
	"log"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/rohan/auth/controllers"
	"github.com/rohan/auth/middlewares"
	service "github.com/rohan/auth/services"
	"github.com/rohan/auth/utils"
)

func SetupRouter() *gin.Engine {
    logger := utils.NewCustomLogger()
    err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}
    
    router := gin.Default()
    store := cookie.NewStore([]byte("secret"))
    router.Use(sessions.Sessions("my-sessions", store))
    router.Use(middlewares.CORS())
    d := service.ConfigDatabase()
    r := service.SetupRedisInstance()
    router.Use(middlewares.GlobalDBVariables(d))
    router.Use(middlewares.GlobalCacheVariables(r))

    logger.Log("INFO", "238eujre", "Auth", "Started Auth Service", utils.LogOptions{})

    // Define routes
    router.GET("/", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{
            "data": "Init successfull",
        })
    })
    router.POST("/api/auth/register", controllers.RegisterUser)
    router.POST("/api/auth/login", controllers.LoginUser)
    router.POST("/api/auth/logout", controllers.LogoutUser)
    router.GET("/api/auth/profile", controllers.TestProfile)
    router.GET("/api/auth/validate", controllers.ValidateRequest)

    return router
}