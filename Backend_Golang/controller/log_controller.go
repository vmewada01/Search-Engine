package controller

import (
	"net/http"
	"strings"
	"vmewada01/search_engine/model"
	"vmewada01/search_engine/service"

	"github.com/labstack/echo/v4"
)

func SearchLogsController(c echo.Context) error {
	query := c.QueryParam("q")
	if query == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Query param 'q' is required"})
	}

	results := service.SearchLogs(query)
	return c.JSON(http.StatusOK, results)
}

func LogsController(c echo.Context) error {
	var req model.LogRequest

	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
	}

	// Default values
	if req.Page <= 0 {
		req.Page = 1
	}
	if req.Limit <= 0 {
		req.Limit = 10
	}

	var logs []model.ParsedLogRecord
	var total int

	// Search path
	if strings.TrimSpace(req.Query) != "" {
		allResults := service.SearchLogs(req.Query)
		total = len(allResults)

		start := (req.Page - 1) * req.Limit
		end := start + req.Limit
		if start > total {
			start = total
		}
		if end > total {
			end = total
		}

		pagedResults := allResults[start:end]
		logs = convertToParsedLogs(pagedResults)
	} else {
		logs, total = service.GetPaginatedLogs(req.Page, req.Limit)
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"page":       req.Page,
		"limit":      req.Limit,
		"total":      total,
		"logs":       logs,
		"totalPages": (total + req.Limit - 1) / req.Limit,
	})
}

func convertToParsedLogs(records []model.LogRecord) []model.ParsedLogRecord {
	var parsed []model.ParsedLogRecord
	for _, r := range records {
		parsed = append(parsed, model.ParsedLogRecord{
			Message:       r.Message,
			Tag:           r.Tag,
			Sender:        r.Sender,
			Groupings:     r.Groupings,
			Event:         r.Event,
			EventId:       r.EventId,
			NanoTimeStamp: r.NanoTimeStamp,
			Namespace:     r.Namespace,
		})
	}
	return parsed
}
