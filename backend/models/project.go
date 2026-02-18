package models

import (
    "time"
    "encoding/json"
    "database/sql/driver"
    "fmt"
)

type Project struct {
    ID          uint      `json:"id" gorm:"primaryKey"`
    Title       string    `json:"title" gorm:"not null" binding:"required"`
    Slug        string    `json:"slug" gorm:"unique;not null" binding:"required"`
    Description string    `json:"description" gorm:"type:text;not null" binding:"required"`
    Content     string    `json:"content" gorm:"type:text"`
    ImageURL    string    `json:"image_url"`
    TechStack   StringArray `json:"tech_stack" gorm:"type:json"`
    GithubLink  string    `json:"github_link"`
    LiveLink    string    `json:"live_link"`
    Featured    bool      `json:"featured" gorm:"default:false"`
    Status      string    `json:"status" gorm:"default:'published'"`
    Views       int       `json:"views" gorm:"default:0"`
    StartDate   time.Time `json:"start_date"`
    EndDate     time.Time `json:"end_date"`
    CreatedAt   time.Time `json:"created_at"`
    UpdatedAt   time.Time `json:"updated_at"`
    
    // Relasi many-to-many dengan Category
    Categories []Category `json:"categories" gorm:"many2many:project_categories;"`
}

// Custom type untuk JSON array di MySQL
type StringArray []string

// Scan implementasi sql.Scanner
func (a *StringArray) Scan(value interface{}) error {
    if value == nil {
        *a = nil
        return nil
    }
    
    bytes, ok := value.([]byte)
    if !ok {
        return fmt.Errorf("failed to unmarshal JSON value: %v", value)
    }
    
    return json.Unmarshal(bytes, a)
}

// Value implementasi driver.Valuer
func (a StringArray) Value() (driver.Value, error) {
    if a == nil {
        return nil, nil
    }
    return json.Marshal(a)
}

type ProjectRequest struct {
    Title       string   `json:"title" binding:"required"`
    Description string   `json:"description" binding:"required"`
    Content     string   `json:"content"`
    ImageURL    string   `json:"image_url"`
    TechStack   []string `json:"tech_stack"`
    GithubLink  string   `json:"github_link"`
    LiveLink    string   `json:"live_link"`
    Featured    bool     `json:"featured"`
    Status      string   `json:"status"`
    StartDate   string   `json:"start_date"`
    EndDate     string   `json:"end_date"`
    CategoryIDs []uint   `json:"category_ids"`
}

// Table for many-to-many relationship
type ProjectCategory struct {
    ProjectID  uint `gorm:"primaryKey"`
    CategoryID uint `gorm:"primaryKey"`
}