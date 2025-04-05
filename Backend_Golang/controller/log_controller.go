package controller

import (
	"net/http"
	"strconv"
	"vmewada01/search_engine/service"

	"github.com/labstack/echo/v4"
)

func SearchLogsHandler(c echo.Context) error {
	query := c.QueryParam("q")
	if query == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Query param 'q' is required"})
	}

	results := service.SearchLogs(query)
	return c.JSON(http.StatusOK, results)
}

func PaginatedLogsHandler(c echo.Context) error {
	page, _ := strconv.Atoi(c.QueryParam("page"))
	limit, _ := strconv.Atoi(c.QueryParam("limit"))

	if page <= 0 {
		page = 1
	}
	if limit <= 0 {
		limit = 10
	}

	logs, total := service.GetPaginatedLogs(page, limit)

	return c.JSON(http.StatusOK, map[string]interface{}{
		"page":       page,
		"limit":      limit,
		"total":      total,
		"logs":       logs,
		"totalPages": (total + limit - 1) / limit,
	})
}
