package models

import (
    "time"
)

type ContactMessage struct {
    ID        uint      `json:"id" gorm:"primaryKey"`
    Name      string    `json:"name"`
    Subject   string    `json:"subject"`
    Message   string    `json:"message" gorm:"type:text"`
    IsRead    bool      `json:"is_read" gorm:"default:false"`
    IsReplied bool      `json:"is_replied" gorm:"default:false"`
    RepliedAt *time.Time `json:"replied_at"`
    CreatedAt time.Time `json:"created_at"`
    UpdatedAt time.Time `json:"updated_at"`
}

type ContactRequest struct {
    Name    string `json:"name" binding:"required"`
    Message string `json:"message" binding:"required"`
}

type ContactSummary struct {
    ID        uint      `json:"id"`
    Name      string    `json:"name"`
    Subject   string    `json:"subject"`
    IsRead    bool      `json:"is_read"`
    IsReplied bool      `json:"is_replied"`
    CreatedAt time.Time `json:"created_at"`
    Preview   string    `json:"preview"`
}

type BulkActionRequest struct {
    Action     string `json:"action" binding:"required"`
    MessageIDs []uint `json:"message_ids" binding:"required"`
}