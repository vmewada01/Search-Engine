package main

import (
	"fmt"
	"log"
	"vmewada01/search_engine/controller"
	"vmewada01/search_engine/service"

	"github.com/labstack/echo/v4"
)

func main() {
	// Load logs into cache
	service.InitLogCache("data")
	fmt.Println("Loaded logs into memory.")
	fmt.Printf("Total records loaded: %d\n", len(service.LogCache))

	e := echo.New()

	// Routes
	e.GET("/search", controller.SearchLogsHandler)
	e.GET("/logs", controller.PaginatedLogsHandler)

	log.Fatal(e.Start(":8080"))
}
