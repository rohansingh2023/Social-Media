package controllers

import (
	"github.com/gin-gonic/gin"
	// "github.com/golang-jwt/jwt/v4"
)

// var jwtSecret = []byte(os.Getenv("JWT_SECRET_KEY"))

func TestProfile(c *gin.Context){
	// session := sessions.Default(c)
	// token := session.Get("jwt")
	// access_token := c.GetHeader("Authorization")
	// refreshToken, erro := c.Cookie("refresh_token")
	// if erro != nil {
	// 	c.JSON(http.StatusUnauthorized, gin.H{"error": "Refresh token not found"})
	// 	return
	// }
	// if token == nil{
	// 	c.JSON(401, gin.H{"error": "unauthorized"})
	// 	return
	// }
	// token, erro := jwt.Parse(access_token, func(token *jwt.Token) (interface{}, error) {
	// 	// Ensure the signing method is correct
	// 	if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
	// 		return nil, jwt.ErrSignatureInvalid
	// 	}
	// 	return jwtSecret, nil
	// })
	// claims, _ := token.Claims.(jwt.MapClaims)

	// if erro != nil {
	// 	c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
	// 	// c.Abort()
	// 	return
	// }
	c.JSON(200, gin.H{"access-token": "This is an access-token"})
} 