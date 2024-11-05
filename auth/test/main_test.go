package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/rohan/auth/routes"
	"github.com/stretchr/testify/assert"
)

func TestMain(t *testing.T){
	// Initialize a Gin router instance
    router := routes.SetupRouter()
	// Create a test HTTP request
    req, _ := http.NewRequest("GET", "/", nil)

    // Create a test HTTP response recorder
    w := httptest.NewRecorder()

    // Perform the request
    router.ServeHTTP(w, req)

	// Assert that the status code is 200
    assert.Equal(t, http.StatusOK, w.Code)

    // Assert that the response contains "pong"
    assert.JSONEq(t, `{"data": "Init successfull"}`, w.Body.String())
}

