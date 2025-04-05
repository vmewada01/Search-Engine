package utils

import (
	"encoding/json"
	"vmewada01/search_engine/model"
)

func ConvertLogWithParsedStruct(record model.LogRecord) model.ParsedLogRecord {
	var structured map[string]interface{}
	var messageRaw map[string]interface{}

	if err := json.Unmarshal([]byte(record.StructuredData), &structured); err != nil {
		structured = map[string]interface{}{"error": "invalid structured data"}
	}
	if err := json.Unmarshal([]byte(record.MessageRaw), &messageRaw); err != nil {
		messageRaw = map[string]interface{}{"error": "invalid message raw"}
	}

	return model.ParsedLogRecord{
		Message:        record.Message,
		MessageRaw:     messageRaw,
		StructuredData: structured,
		Tag:            record.Tag,
		Sender:         record.Sender,
		Groupings:      record.Groupings,
		Event:          record.Event,
		EventId:        record.EventId,
		NanoTimeStamp:  record.NanoTimeStamp,
		Namespace:      record.Namespace,
	}
}
