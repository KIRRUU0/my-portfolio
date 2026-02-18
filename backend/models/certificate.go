package models

import (
    "time"
)

type Certificate struct {
    ID          uint      `json:"id" gorm:"primaryKey"`
    Name        string    `json:"name" gorm:"not null" binding:"required"`
    Vendor      string    `json:"vendor" gorm:"not null" binding:"required"`
    Date        time.Time `json:"date" gorm:"not null" binding:"required"`
    ImageURL    string    `json:"image_url" binding:"required"`
    Description string    `json:"description" gorm:"type:text"`
    CredentialID string   `json:"credential_id"`
    CredentialURL string  `json:"credential_url"`
    CreatedAt   time.Time `json:"created_at"`
    UpdatedAt   time.Time `json:"updated_at"`
}

type CertificateRequest struct {
    Name         string `json:"name" binding:"required"`
    Vendor       string `json:"vendor" binding:"required"`
    Date         string `json:"date" binding:"required"`
    ImageURL     string `json:"image_url" binding:"required"`
    Description  string `json:"description"`
    CredentialID string `json:"credential_id"`
    CredentialURL string `json:"credential_url"`
}