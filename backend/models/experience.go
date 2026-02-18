package models

import (
    "time"
)

type Experience struct {
    ID          uint      `json:"id" gorm:"primaryKey"`
    Company     string    `json:"company" gorm:"not null" binding:"required"`
    Position    string    `json:"position" gorm:"not null" binding:"required"`
    Description string    `json:"description" gorm:"type:text;not null" binding:"required"`
    Location    string    `json:"location"`
    StartDate   time.Time `json:"start_date" gorm:"not null" binding:"required"`
    EndDate     *time.Time `json:"end_date"`
    Current     bool      `json:"current" gorm:"default:false"`
    Achievements StringArray `json:"achievements" gorm:"type:json"`
    CompanyLogo string    `json:"company_logo"`
    CreatedAt   time.Time `json:"created_at"`
    UpdatedAt   time.Time `json:"updated_at"`
}

type ExperienceRequest struct {
    Company      string   `json:"company" binding:"required"`
    Position     string   `json:"position" binding:"required"`
    Description  string   `json:"description" binding:"required"`
    Location     string   `json:"location"`
    StartDate    string   `json:"start_date" binding:"required"`
    EndDate      string   `json:"end_date"`
    Current      bool     `json:"current"`
    Achievements []string `json:"achievements"`
    CompanyLogo  string   `json:"company_logo"`
}