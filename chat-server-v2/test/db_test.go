package test

import (
	"context"
	"testing"
	"time"

	"github.com/stretchr/testify/mock"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

type MockMongoClient struct {
	mock.Mock
}

func (m *MockMongoClient) Connect(ctx context.Context) (*mongo.Client, error) {
	args := m.Called(ctx)
	return args.Get(0).(*mongo.Client), args.Error(1)
}

func (m *MockMongoClient) Ping(ctx context.Context, rp *readpref.ReadPref) error {
	args := m.Called(ctx, rp)
	return args.Error(0)
}

// MockMongoCollection mocks the MongoDB collection
type MockMongoCollection struct {
	mock.Mock
}

func (m *MockMongoCollection) Find(ctx context.Context, filter interface{}, opts ...*options.FindOptions) (*mongo.Cursor, error) {
	args := m.Called(ctx, filter, opts)
	return args.Get(0).(*mongo.Cursor), args.Error(1)
}

func (m *MockMongoCollection) FindOne(ctx context.Context, filter interface{}, opts ...*options.FindOneOptions) *mongo.SingleResult {
	args := m.Called(ctx, filter, opts)
	return args.Get(0).(*mongo.SingleResult)
}

func (m *MockMongoCollection) InsertOne(ctx context.Context, document interface{}, opts ...*options.InsertOneOptions) (*mongo.InsertOneResult, error) {
	args := m.Called(ctx, document, opts)
	return args.Get(0).(*mongo.InsertOneResult), args.Error(1)
}

func TestConfigDatabaseWithMock(t *testing.T) {
	// Create a new MockMongoClient instance
	mockClient := new(MockMongoClient)

	// Set up expectations
	mockClient.On("Connect", mock.Anything).Return(&mongo.Client{}, nil)
	mockClient.On("Ping", mock.Anything, readpref.Primary()).Return(nil)

	// Use the mock client in the ConfigDatabase function
	clientOptions := options.Client().ApplyURI("mongodb://localhost:27017/smChatDb?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false")
	t.Log(clientOptions)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_, err := mockClient.Connect(ctx)
	if err != nil {
		t.Fatalf("Failed to connect to MongoDB: %v", err)
	}

	if err := mockClient.Ping(ctx, readpref.Primary()); err != nil {
		t.Fatalf("Failed to ping MongoDB: %v", err)
	}

	t.Log("Successfully connected and pinged MongoDB with mock client")
}
