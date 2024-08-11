package test

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/rohan/chat-server-v2/controllers"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func TestGetConversationsOfUser(t *testing.T) {
	gin.SetMode(gin.TestMode)

	router := gin.Default()

	mockClient := new(MockMongoClient)
	mockCollection := new(MockMongoCollection)

	// Mock the Database and Collection methods
	mockDatabase := new(mongo.Database)
	mockClient.On("Database", "testdb", mock.Anything).Return(mockDatabase)
	mockDatabase.On("Collection", "conversations").Return(mockCollection)

	router.Use(func(c *gin.Context) {
		c.Set("client", mockClient)
		c.Next()
	})

	api := router.Group("/api")
	{
		api.GET("/conversations/user/62d1c260c4bd7a545518a94d", controllers.GetConversationOfAUser)
	}

	t.Run("Should get conversations of a user", func(t *testing.T) {
		mockCursor := new(mocks.MockCursor)
		conversation := bson.M{"members": []string{"user1", "user2"}}
		mockCursor.On("All", mock.Anything, mock.Anything).Return(nil).Run(func(args mock.Arguments) {
			arg := args.Get(1).(*[]bson.M)
			*arg = append(*arg, conversation)
		})
		mockCollection.On("Find", mock.Anything, mock.Anything, mock.Anything).Return(mockCursor, nil)

		req, _ := http.NewRequest(http.MethodGet, "/api/conversations/user/user1", nil)
		w := httptest.NewRecorder()

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.Contains(t, w.Body.String(), "user1")
	})
}
