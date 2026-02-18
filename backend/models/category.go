package models

import (
	"time"
)

type Category struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	Name        string    `json:"name" gorm:"unique;not null" binding:"required"`
	Slug        string    `json:"slug" gorm:"unique;not null" binding:"required"`
	Description string    `json:"description" gorm:"type:text"`
	Color       string    `json:"color" gorm:"default:'#4CAF50'"`
	Icon        string    `json:"icon" gorm:"default:'folder'"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`

	// Relasi
	Projects []Project `json:"projects" gorm:"many2many:project_categories;"`
}

type CategoryRequest struct {
	Name        string `json:"name" binding:"required"`
	Description string `json:"description"`
	Color       string `json:"color"`
	Icon        string `json:"icon"`
}
