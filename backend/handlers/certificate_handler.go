package handlers

import (
    "net/http"
    "strconv"
    "time"
    "strings"
    "github.com/gin-gonic/gin"
    "gorm.io/gorm"
	"myportfolio-backend/services"
    "myportfolio-backend/models"
)

type CertificateHandler struct {
    DB *gorm.DB
	Storage *services.StorageService
}

// GET /api/certificates - Public
func (h *CertificateHandler) GetCertificates(c *gin.Context) {
    var certificates []models.Certificate
    
    result := h.DB.Order("date DESC").Find(&certificates)
    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "success": false,
            "error":   "Failed to fetch certificates",
        })
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "success":      true,
        "certificates": certificates,
    })
}

// GET /api/certificates/:id - Public
func (h *CertificateHandler) GetCertificate(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "success": false,
            "error":   "Invalid ID",
        })
        return
    }

    var certificate models.Certificate
    result := h.DB.First(&certificate, id)
    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{
            "success": false,
            "error":   "Certificate not found",
        })
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "success":     true,
        "certificate": certificate,
    })
}

// POST /api/admin/certificates - Protected
func (h *CertificateHandler) CreateCertificate(c *gin.Context) {
    var req models.CertificateRequest

    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "success": false,
            "error":   "Invalid certificate data",
        })
        return
    }

    // Parse date
    date, _ := time.Parse("2006-01-02", req.Date)

    certificate := models.Certificate{
        Name:         req.Name,
        Vendor:       req.Vendor,
        Date:         date,
        ImageURL:     req.ImageURL,
        Description:  req.Description,
        CredentialID: req.CredentialID,
        CredentialURL: req.CredentialURL,
        CreatedAt:    time.Now(),
        UpdatedAt:    time.Now(),
    }

    result := h.DB.Create(&certificate)
    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "success": false,
            "error":   "Failed to create certificate",
        })
        return
    }

    c.JSON(http.StatusCreated, gin.H{
        "success":     true,
        "message":     "Certificate created successfully",
        "certificate": certificate,
    })
}

// PUT /api/admin/certificates/:id - Protected
func (h *CertificateHandler) UpdateCertificate(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "success": false,
            "error":   "Invalid ID",
        })
        return
    }

    var req models.CertificateRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "success": false,
            "error":   "Invalid certificate data",
        })
        return
    }

    var certificate models.Certificate
    result := h.DB.First(&certificate, id)
    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{
            "success": false,
            "error":   "Certificate not found",
        })
        return
    }

    // Parse date
    date, _ := time.Parse("2006-01-02", req.Date)

    updates := map[string]interface{}{
        "Name":          req.Name,
        "Vendor":        req.Vendor,
        "Date":          date,
        "ImageURL":      req.ImageURL,
        "Description":   req.Description,
        "CredentialID":  req.CredentialID,
        "CredentialURL": req.CredentialURL,
        "UpdatedAt":     time.Now(),
    }

    h.DB.Model(&certificate).Updates(updates)

    c.JSON(http.StatusOK, gin.H{
        "success":     true,
        "message":     "Certificate updated successfully",
        "certificate": certificate,
    })
}

// DELETE /api/admin/certificates/:id - Protected
func (h *CertificateHandler) DeleteCertificate(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "success": false,
            "error":   "Invalid ID",
        })
        return
    }

    result := h.DB.Delete(&models.Certificate{}, id)
    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "success": false,
            "error":   "Failed to delete certificate",
        })
        return
    }

    if result.RowsAffected == 0 {
        c.JSON(http.StatusNotFound, gin.H{
            "success": false,
            "error":   "Certificate not found",
        })
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "success": true,
        "message": "Certificate deleted successfully",
    })
}

// POST /api/admin/certificates/upload-image - Protected
func (h *CertificateHandler) UploadImage(c *gin.Context) {
    file, err := c.FormFile("image")
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "success": false,
            "error":   "No file uploaded",
        })
        return
    }

    // Validasi ukuran (max 5MB)
    if file.Size > 5<<20 {
        c.JSON(http.StatusBadRequest, gin.H{
            "success": false,
            "error":   "File too large (max 5MB)",
        })
        return
    }

    // Validasi tipe file
    ext := strings.ToLower(file.Filename[strings.LastIndex(file.Filename, "."):])
    allowed := map[string]bool{".jpg": true, ".jpeg": true, ".png": true, ".gif": true, ".webp": true}
    if !allowed[ext] {
        c.JSON(http.StatusBadRequest, gin.H{
            "success": false,
            "error":   "Invalid file type. Allowed: jpg, jpeg, png, gif, webp",
        })
        return
    }

    // Buka file
    src, err := file.Open()
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "success": false,
            "error":   "Failed to open file",
        })
        return
    }
    defer src.Close()

    // Upload ke Supabase Storage
    imageURL, err := h.Storage.UploadFile(h.Storage.CertBucket, src, file.Filename)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "success": false,
            "error":   "Failed to upload to Supabase: " + err.Error(),
        })
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "success":   true,
        "image_url": imageURL,
    })
}