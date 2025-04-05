package model

type LogRequest struct {
	Page  int    `json:"page"`
	Limit int    `json:"limit"`
	Query string `json:"query"`
}

type LogRecord struct {
	Message        string `parquet:"name=Message, type=BYTE_ARRAY, convertedtype=UTF8"`
	MessageRaw     string `parquet:"name=MessageRaw, type=BYTE_ARRAY, convertedtype=UTF8"`
	StructuredData string `parquet:"name=StructuredData, type=BYTE_ARRAY, convertedtype=UTF8"`
	Tag            string `parquet:"name=Tag, type=BYTE_ARRAY, convertedtype=UTF8"`
	Sender         string `parquet:"name=Sender, type=BYTE_ARRAY, convertedtype=UTF8"`
	Groupings      string `parquet:"name=Groupings, type=BYTE_ARRAY, convertedtype=UTF8"`
	Event          string `parquet:"name=Event, type=BYTE_ARRAY, convertedtype=UTF8"`
	EventId        string `parquet:"name=EventId, type=BYTE_ARRAY, convertedtype=UTF8"`
	NanoTimeStamp  string `parquet:"name=NanoTimeStamp, type=BYTE_ARRAY, convertedtype=UTF8"`
	Namespace      string `parquet:"name=namespace, type=BYTE_ARRAY, convertedtype=UTF8"`
}

type ParsedLogRecord struct {
	Message        string                 `json:"Message"`
	MessageRaw     map[string]interface{} `json:"MessageRaw"`
	StructuredData map[string]interface{} `json:"StructuredData"`
	Tag            string                 `json:"Tag"`
	Sender         string                 `json:"Sender"`
	Groupings      string                 `json:"Groupings"`
	Event          string                 `json:"Event"`
	EventId        string                 `json:"EventId"`
	NanoTimeStamp  string                 `json:"NanoTimeStamp"`
	Namespace      string                 `json:"Namespace"`
}
