package utils

import (
	"fmt"
	"os"
	"path/filepath"
	"sync"
	"time"

	"github.com/sirupsen/logrus"
)

type CustomLogger struct {
	log *logrus.Logger
	mu sync.Mutex
}

type LogOptions struct {
    StatusCode *int
    SourceURL  *string
    TargetURL  *string
}

type CustomFormatter struct{}

func (f *CustomFormatter) Format(entry *logrus.Entry) ([]byte, error) {
    timestamp := entry.Time.Format("2006-01-02T15:04:05-07:00")
    return []byte(fmt.Sprintf("%s %s %s [%s] %s\n",
	entry.Data["Type"], timestamp,
        entry.Data["Log-Id"], entry.Data["Service Name"], entry.Message,
    )), nil
}

func NewCustomLogger() *CustomLogger {
    log := logrus.New()
    
    // Set custom formatter
    log.SetFormatter(&CustomFormatter{})

    logDir := "logs"
    if err := os.MkdirAll(logDir, os.ModePerm); err != nil {
        log.Fatal(err)
    }

    logFile, err := os.OpenFile(filepath.Join(logDir, time.Now().Format("2006-01-02")+".log"), os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0666)
    if err != nil {
        log.Fatal(err)
    }

    log.SetOutput(logFile)

    return &CustomLogger{log: log}
}

func (cl *CustomLogger) Log(logType, logId, serviceName, message string, options LogOptions) {
    cl.mu.Lock()
    defer cl.mu.Unlock()

    // Log the main message
    cl.log.WithFields(logrus.Fields{
        "Type":        logType,
        "Log-Id":     logId,
        "Service Name": serviceName,
    }).Info(message)

    // Log optional fields if provided
    if options.StatusCode != nil {
        cl.log.WithFields(logrus.Fields{
            "Type":        logType,
            "Log-Id":     logId,
            "Service Name": serviceName,
        }).Info(fmt.Sprintf("Status Code: %d", *options.StatusCode))
    }

    if options.SourceURL != nil {
        cl.log.WithFields(logrus.Fields{
            "Type":        logType,
            "Log-Id":     logId,
            "Service Name": serviceName,
        }).Info(fmt.Sprintf("Source URL: %s", *options.SourceURL))
    }

    if options.TargetURL != nil {
        cl.log.WithFields(logrus.Fields{
            "Type":        logType,
            "Log-Id":     logId,
            "Service Name": serviceName,
        }).Info(fmt.Sprintf("Target URL: %s", *options.TargetURL))
    }
}