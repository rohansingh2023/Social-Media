package main

import (
	"log"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/rohan/auth/routes"
	"github.com/stretchr/testify/assert"
)

func TestRegisterUserRoute(t *testing.T){
	r := routes.SetupRouter()
	req, err := http.NewRequest("POST", "/register", nil)
	if(err != nil){
		log.Fatal(err)
	}
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)
	// assert.JSONEq(t, `{"Message": "Post Route"}`, w.Body.String())
}
