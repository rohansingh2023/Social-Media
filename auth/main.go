package main

import (
	"github.com/rohan/auth/routes"
)

func main() {
	r := routes.SetupRouter()
	r.Run(":7007")
}