package main

import (
	"fmt"
	"log"
	"vmewada01/search_engine/controller"
	"vmewada01/search_engine/service"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	// Load logs into cache
	service.InitLogCache("data")
	fmt.Println("Loaded logs into memory.")
	fmt.Printf("Total records loaded: %d\n", len(service.LogCache))

	e := echo.New()

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{
			echo.GET,
			echo.POST,
			echo.PUT,
			echo.DELETE,
			echo.OPTIONS,
		},
	}))

	// Routes
	e.GET("/search", controller.SearchLogsController)
	e.POST("/logs", controller.LogsController)
	e.POST("/upload", controller.UploadParquetFile)

	log.Fatal(e.Start(":8080"))
}
