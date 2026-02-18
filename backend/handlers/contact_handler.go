package handlers

import (
    "net/http"
    "os"
    "strconv"
    "time"
    "net/url"
    "github.com/gin-gonic/gin"
    "gorm.io/gorm"
    "myportfolio-backend/models"
)

type ContactHandler struct {
    DB *gorm.DB
}

// POST /api/contact - Public: Submit pesan baru
func (h *ContactHandler) SubmitContact(c *gin.Context) {
    var req struct {
        Name    string `json:"name"`
        Message string `json:"message"`
    }

    // Binding JSON
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "success": false,
            "error": "Invalid JSON format: " + err.Error(),
        })
        return
    }

    // Validasi sederhana
    if req.Name == "" {
        c.JSON(http.StatusBadRequest, gin.H{
            "success": false,
            "error": "Name is required",
        })
        return
    }

    if req.Message == "" {
        c.JSON(http.StatusBadRequest, gin.H{
            "success": false,
            "error": "Message is required",
        })
        return
    }

    // Buat contact message
    contact := models.ContactMessage{
        Name:      req.Name,
        Subject:   "New Message from Portfolio",
        Message:   req.Message,
        IsRead:    false,
        IsReplied: false,
        CreatedAt: time.Now(),
        UpdatedAt: time.Now(),
    }

    // Simpan ke database
    result := h.DB.Create(&contact)
    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "success": false,
            "error": "Failed to save message",
        })
        return
    }

    // Generate WhatsApp link
    waNumber := os.Getenv("WHATSAPP_NUMBER")
    waMessage := "Nama: " + req.Name + "\nPesan: " + req.Message
    waLink := "https://wa.me/" + waNumber + "?text=" + url.QueryEscape(waMessage)

    c.JSON(http.StatusOK, gin.H{
        "success": true,
        "message": "Message sent successfully",
        "data": gin.H{
            "contact_id":     contact.ID,
            "whatsapp_link":  waLink,
        },
    })
}

// GET /api/admin/contacts - Protected: Ambil semua pesan
func (h *ContactHandler) GetMessages(c *gin.Context) {
    var messages []models.ContactMessage
    var total int64

    h.DB.Model(&models.ContactMessage{}).Count(&total)
    result := h.DB.Order("created_at DESC").Find(&messages)
    
    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "success": false,
            "error":   "Failed to fetch messages",
        })
        return
    }

    summaries := make([]models.ContactSummary, len(messages))
    for i, msg := range messages {
        preview := msg.Message
        if len(preview) > 50 {
            preview = preview[:50] + "..."
        }
        summaries[i] = models.ContactSummary{
            ID:        msg.ID,
            Name:      msg.Name,
            Subject:   msg.Subject,
            IsRead:    msg.IsRead,
            IsReplied: msg.IsReplied,
            CreatedAt: msg.CreatedAt,
            Preview:   preview,
        }
    }

    c.JSON(http.StatusOK, gin.H{
        "success":  true,
        "total":    total,
        "messages": summaries,
    })
}

// GET /api/admin/contacts/stats - Protected: Statistik pesan
func (h *ContactHandler) GetStats(c *gin.Context) {
    var total, unread, replied int64

    h.DB.Model(&models.ContactMessage{}).Count(&total)
    h.DB.Model(&models.ContactMessage{}).Where("is_read = ?", false).Count(&unread)
    h.DB.Model(&models.ContactMessage{}).Where("is_replied = ?", true).Count(&replied)

    c.JSON(http.StatusOK, gin.H{
        "success": true,
        "total":   total,
        "unread":  unread,
        "read":    total - unread,
        "replied": replied,
    })
}

// GET /api/admin/contacts/:id - Protected: Detail pesan
func (h *ContactHandler) GetMessageDetail(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "success": false,
            "error":   "Invalid ID",
        })
        return
    }

    var message models.ContactMessage
    result := h.DB.First(&message, id)
    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{
            "success": false,
            "error":   "Message not found",
        })
        return
    }

    if !message.IsRead {
        h.DB.Model(&message).Update("is_read", true)
    }

    c.JSON(http.StatusOK, gin.H{
        "success": true,
        "message": message,
    })
}

// POST /api/admin/contacts/:id/reply - Protected: Tandai sudah dibalas
func (h *ContactHandler) MarkAsReplied(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "success": false,
            "error":   "Invalid ID",
        })
        return
    }

    now := time.Now()
    result := h.DB.Model(&models.ContactMessage{}).Where("id = ?", id).Updates(map[string]interface{}{
        "is_replied": true,
        "replied_at": now,
        "updated_at": now,
    })

    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "success": false,
            "error":   "Failed to mark as replied",
        })
        return
    }

    if result.RowsAffected == 0 {
        c.JSON(http.StatusNotFound, gin.H{
            "success": false,
            "error":   "Message not found",
        })
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "success":    true,
        "message":    "Message marked as replied",
        "replied_at": now,
    })
}

// DELETE /api/admin/contacts/:id - Protected: Hapus pesan
func (h *ContactHandler) DeleteMessage(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "success": false,
            "error":   "Invalid ID",
        })
        return
    }

    result := h.DB.Delete(&models.ContactMessage{}, id)
    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "success": false,
            "error":   "Failed to delete message",
        })
        return
    }

    if result.RowsAffected == 0 {
        c.JSON(http.StatusNotFound, gin.H{
            "success": false,
            "error":   "Message not found",
        })
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "success": true,
        "message": "Message deleted successfully",
    })
}

// POST /api/admin/contacts/bulk - Protected: Aksi massal
func (h *ContactHandler) BulkAction(c *gin.Context) {
    var req models.BulkActionRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "success": false,
            "error":   "Invalid request",
        })
        return
    }

    now := time.Now()
    var result *gorm.DB

    switch req.Action {
    case "read":
        result = h.DB.Model(&models.ContactMessage{}).
            Where("id IN ?", req.MessageIDs).
            Updates(map[string]interface{}{
                "is_read":    true,
                "updated_at": now,
            })
    case "unread":
        result = h.DB.Model(&models.ContactMessage{}).
            Where("id IN ?", req.MessageIDs).
            Updates(map[string]interface{}{
                "is_read":    false,
                "updated_at": now,
            })
    case "delete":
        result = h.DB.Delete(&models.ContactMessage{}, req.MessageIDs)
    default:
        c.JSON(http.StatusBadRequest, gin.H{
            "success": false,
            "error":   "Invalid action",
        })
        return
    }

    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "success": false,
            "error":   "Failed to perform bulk action",
        })
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "success":       true,
        "message":       "Bulk action completed",
        "action":        req.Action,
        "affected_rows": result.RowsAffected,
    })
}