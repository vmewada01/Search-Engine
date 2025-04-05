package controller

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"reflect"
	"strings"
	"vmewada01/search_engine/model"
	"vmewada01/search_engine/service"

	"github.com/labstack/echo/v4"
	"github.com/xitongsys/parquet-go-source/local"
	"github.com/xitongsys/parquet-go/reader"
)

const (
	uploadDir     = "data"
	referenceFile = "data/file1.parquet"
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

func UploadParquetFile(c echo.Context) error {
	file, err := c.FormFile("file")
	if err != nil {
		return c.String(http.StatusBadRequest, "Failed to get uploaded file")
	}

	if !strings.HasSuffix(file.Filename, ".parquet") {
		return c.String(http.StatusBadRequest, "Only .parquet files allowed")
	}

	src, err := file.Open()
	if err != nil {
		return c.String(http.StatusInternalServerError, "Unable to read uploaded file")
	}
	defer src.Close()

	tempPath := filepath.Join(uploadDir, "temp.parquet")
	dst, err := os.Create(tempPath)
	if err != nil {
		return c.String(http.StatusInternalServerError, "Unable to save file temporarily")
	}
	defer dst.Close()

	if _, err := io.Copy(dst, src); err != nil {
		return c.String(http.StatusInternalServerError, "Error saving file")
	}

	refTypes, err := extractColumnTypes(referenceFile)
	if err != nil {
		return c.String(http.StatusInternalServerError, fmt.Sprintf("Failed to read reference file: %v", err))
	}

	newTypes, err := extractColumnTypes(tempPath)
	if err != nil {
		return c.String(http.StatusInternalServerError, fmt.Sprintf("Failed to read uploaded file: %v", err))
	}

	if !reflect.DeepEqual(refTypes, newTypes) {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"error":     "Uploaded file structure doesn't match file1.parquet",
			"reference": refTypes,
			"uploaded":  newTypes,
		})
	}

	newPath := filepath.Join(uploadDir, file.Filename)

	return c.JSON(http.StatusOK, map[string]string{
		"message":  "File uploaded and validated successfully",
		"filename": file.Filename,
		"path":     newPath,
	})
}

func extractColumnTypes(path string) (map[string]string, error) {
	fr, err := local.NewLocalFileReader(path)
	if err != nil {
		return nil, err
	}
	defer fr.Close()

	pr, err := reader.NewParquetReader(fr, nil, 1)
	if err != nil {
		return nil, err
	}
	defer pr.ReadStop()

	num := int(pr.GetNumRows())
	if num > 10 {
		num = 10
	}
	records, err := pr.ReadByNumber(num)
	if err != nil || len(records) == 0 {
		return nil, fmt.Errorf("failed to read rows")
	}

	colTypes := make(map[string]string)

	// Reflect on first record
	v := reflect.ValueOf(records[0])
	t := v.Type()

	switch t.Kind() {
	case reflect.Map:
		for _, key := range v.MapKeys() {
			val := v.MapIndex(key)
			colTypes[fmt.Sprintf("%v", key.Interface())] = val.Type().String()
		}
	case reflect.Struct:
		for i := 0; i < t.NumField(); i++ {
			field := t.Field(i)
			fieldVal := v.Field(i)
			colTypes[field.Name] = fieldVal.Type().String()
		}
	default:
		return nil, fmt.Errorf("unsupported record type: %v", t.Kind())
	}

	return colTypes, nil
}
