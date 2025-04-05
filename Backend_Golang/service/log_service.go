package service

import (
	"log"
	"path/filepath"
	"strings"
	"vmewada01/search_engine/model"
	"vmewada01/search_engine/utils"

	"github.com/xitongsys/parquet-go-source/local"
	"github.com/xitongsys/parquet-go/reader"
)

var LogCache []model.LogRecord

func InitLogCache(folderPath string) {
	files, _ := filepath.Glob(filepath.Join(folderPath, "*.parquet"))

	for _, file := range files {
		fr, err := local.NewLocalFileReader(file)
		if err != nil {
			log.Printf("Failed to open %s: %v", file, err)
			continue
		}

		pr, err := reader.NewParquetReader(fr, new(model.LogRecord), 4)
		if err != nil {
			log.Printf("Failed to read %s: %v", file, err)
			continue
		}

		num := int(pr.GetNumRows())
		records := make([]model.LogRecord, num)

		if err := pr.Read(&records); err != nil {
			log.Printf("Failed to read rows from %s: %v", file, err)
			continue
		}

		LogCache = append(LogCache, records...)

		pr.ReadStop()
		fr.Close()
	}
}

func SearchLogs(query string) []model.LogRecord {
	var result []model.LogRecord
	q := strings.ToLower(query)

	for _, record := range LogCache {
		if strings.Contains(strings.ToLower(record.Message), q) ||
			strings.Contains(strings.ToLower(record.MessageRaw), q) ||
			strings.Contains(strings.ToLower(record.StructuredData), q) ||
			strings.Contains(strings.ToLower(record.Tag), q) ||
			strings.Contains(strings.ToLower(record.Sender), q) ||
			strings.Contains(strings.ToLower(record.Groupings), q) ||
			strings.Contains(strings.ToLower(record.Event), q) ||
			strings.Contains(strings.ToLower(record.EventId), q) ||
			strings.Contains(strings.ToLower(record.NanoTimeStamp), q) ||
			strings.Contains(strings.ToLower(record.Namespace), q) {
			result = append(result, record)
		}
	}

	return result
}

func GetPaginatedLogs(page, limit int) ([]model.ParsedLogRecord, int) {
	start := (page - 1) * limit
	end := start + limit

	if start > len(LogCache) {
		start = len(LogCache)
	}
	if end > len(LogCache) {
		end = len(LogCache)
	}

	rawPage := LogCache[start:end]
	var parsed []model.ParsedLogRecord

	for _, rec := range rawPage {
		parsed = append(parsed, utils.ConvertLogWithParsedStruct(rec))
	}

	return parsed, len(LogCache)
}
