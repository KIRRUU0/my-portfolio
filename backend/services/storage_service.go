package services

import (
	"bytes"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"
	"time"

	storage_go "github.com/supabase-community/storage-go"
)

type StorageService struct {
	Client          *storage_go.Client
	ProjectsBucket  string
	CertBucket      string
	AvatarsBucket   string
	SupabaseURL     string
}

// Inisialisasi Storage Service
func NewStorageService() (*StorageService, error) {
	supabaseURL := os.Getenv("SUPABASE_URL")
	serviceKey := os.Getenv("SUPABASE_SERVICE_KEY")
	
	if supabaseURL == "" || serviceKey == "" {
		return nil, fmt.Errorf("SUPABASE_URL and SUPABASE_SERVICE_KEY must be set")
	}

	// Format URL untuk Storage API
	storageURL := fmt.Sprintf("%s/storage/v1", supabaseURL)
	
	// Buat client
	client := storage_go.NewClient(storageURL, serviceKey, nil)
	
	// Dapatkan bucket names dari environment
	projectsBucket := os.Getenv("SUPABASE_BUCKET_PROJECTS")
	if projectsBucket == "" {
		projectsBucket = "projects"
	}
	
	certBucket := os.Getenv("SUPABASE_BUCKET_CERTIFICATES")
	if certBucket == "" {
		certBucket = "certificates"
	}
	
	avatarsBucket := os.Getenv("SUPABASE_BUCKET_AVATARS")
	if avatarsBucket == "" {
		avatarsBucket = "avatars"
	}
	
	return &StorageService{
		Client:         client,
		ProjectsBucket: projectsBucket,
		CertBucket:     certBucket,
		AvatarsBucket:  avatarsBucket,
		SupabaseURL:    supabaseURL,
	}, nil
}

// Upload file ke bucket tertentu
func (s *StorageService) UploadFile(bucket string, file multipart.File, filename string) (string, error) {
	// Baca file ke memory
	fileBytes, err := io.ReadAll(file)
	if err != nil {
		return "", fmt.Errorf("failed to read file: %v", err)
	}
	
	// Generate unique filename
	ext := filepath.Ext(filename)
	name := strings.TrimSuffix(filename, ext)
	timestamp := time.Now().Format("20060102150405")
	uniqueFilename := fmt.Sprintf("%s_%s%s", name, timestamp, ext)
	
	// Upload ke Supabase
	_, err = s.Client.UploadFile(bucket, uniqueFilename, bytes.NewReader(fileBytes))
	if err != nil {
		return "", fmt.Errorf("failed to upload to Supabase: %v", err)
	}
	
	// Dapatkan public URL
	publicURL := s.GetPublicURL(bucket, uniqueFilename)
	
	return publicURL, nil
}

// Upload file dari path lokal
func (s *StorageService) UploadFileFromPath(bucket string, filePath string) (string, error) {
	// Buka file
	file, err := os.Open(filePath)
	if err != nil {
		return "", fmt.Errorf("failed to open file: %v", err)
	}
	defer file.Close()
	
	// Baca file
	fileBytes, err := io.ReadAll(file)
	if err != nil {
		return "", fmt.Errorf("failed to read file: %v", err)
	}
	
	// Dapatkan filename
	filename := filepath.Base(filePath)
	
	// Generate unique filename
	ext := filepath.Ext(filename)
	name := strings.TrimSuffix(filename, ext)
	timestamp := time.Now().Format("20060102150405")
	uniqueFilename := fmt.Sprintf("%s_%s%s", name, timestamp, ext)
	
	// Upload ke Supabase
	_, err = s.Client.UploadFile(bucket, uniqueFilename, bytes.NewReader(fileBytes))
	if err != nil {
		return "", fmt.Errorf("failed to upload to Supabase: %v", err)
	}
	
	// Dapatkan public URL
	publicURL := s.GetPublicURL(bucket, uniqueFilename)
	
	return publicURL, nil
}

// Hapus file dari bucket
func (s *StorageService) DeleteFile(bucket string, fileURL string) error {
	// Extract filename dari URL
	filename := filepath.Base(fileURL)
	
	// Hapus dari Supabase
	_, err := s.Client.RemoveFile(bucket, []string{filename})
	if err != nil {
		return fmt.Errorf("failed to delete from Supabase: %v", err)
	}
	
	return nil
}

// Dapatkan public URL
func (s *StorageService) GetPublicURL(bucket string, filename string) string {
	return fmt.Sprintf("%s/storage/v1/object/public/%s/%s", s.SupabaseURL, bucket, filename)
}

// Dapatkan signed URL (untuk file private)
func (s *StorageService) GetSignedURL(bucket string, filename string, expiresIn int) (string, error) {
	result, err := s.Client.CreateSignedUrl(bucket, filename, expiresIn)
	if err != nil {
		return "", err
	}
	return result.SignedURL, nil
}

// List files dalam bucket
func (s *StorageService) ListFiles(bucket string, folder string) ([]map[string]interface{}, error) {
	options := storage_go.FileSearchOptions{
		Limit:  100,
		Offset: 0,
		SortByOptions: storage_go.SortBy{
			Column: "created_at",
			Order:  "desc",
		},
	}
	
	result, err := s.Client.ListFiles(bucket, folder, options)
	if err != nil {
		return nil, err
	}
	
	// Convert []storage_go.FileObject to []map[string]interface{}
	var files []map[string]interface{}
	for _, file := range result {
		fileMap := map[string]interface{}{
			"name":       file.Name,
			"id":         file.Id,
			"updated_at": file.UpdatedAt,
			"created_at": file.CreatedAt,
			"last_accessed_at": file.LastAccessedAt,
			"metadata":   file.Metadata,
		}
		files = append(files, fileMap)
	}
	
	return files, nil
}

// Buat bucket baru (jika belum ada)
func (s *StorageService) CreateBucketIfNotExists(bucket string, isPublic bool) error {
	// Cek apakah bucket sudah ada
	buckets, err := s.Client.ListBuckets()
	if err != nil {
		return err
	}
	
	// Cari bucket
	for _, b := range buckets {
		if b.Name == bucket {
			log.Printf("Bucket %s already exists", bucket)
			return nil
		}
	}
	
	// Buat bucket baru
	options := storage_go.BucketOptions{
		Public: isPublic,
	}
	
	_, err = s.Client.CreateBucket(bucket, options)
	if err != nil {
		return fmt.Errorf("failed to create bucket: %v", err)
	}
	
	log.Printf("Bucket %s created successfully", bucket)
	return nil
}

// Inisialisasi semua bucket yang diperlukan
func (s *StorageService) InitBuckets() error {
	buckets := []struct {
		Name   string
		Public bool
	}{
		{s.ProjectsBucket, true},
		{s.CertBucket, true},
		{s.AvatarsBucket, true},
	}
	
	for _, b := range buckets {
		if err := s.CreateBucketIfNotExists(b.Name, b.Public); err != nil {
			log.Printf("Warning: Failed to create bucket %s: %v", b.Name, err)
		}
	}
	
	return nil
}