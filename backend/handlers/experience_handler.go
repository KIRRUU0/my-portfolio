package handlers

import (
    "net/http"
    "strconv"
    "time"
    "github.com/gin-gonic/gin"
    "gorm.io/gorm"
    "myportfolio-backend/models"
)

type ExperienceHandler struct {
    DB *gorm.DB
}

// GET /api/experiences - Public
func (h *ExperienceHandler) GetExperiences(c *gin.Context) {
    var experiences []models.Experience
    
    result := h.DB.Order("start_date DESC").Find(&experiences)
    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "success": false,
            "error":   "Failed to fetch experiences",
        })
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "success":     true,
        "experiences": experiences,
    })
}

// GET /api/experiences/:id - Public
func (h *ExperienceHandler) GetExperience(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "success": false,
            "error":   "Invalid ID",
        })
        return
    }

    var experience models.Experience
    result := h.DB.First(&experience, id)
    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{
            "success": false,
            "error":   "Experience not found",
        })
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "success":    true,
        "experience": experience,
    })
}

// POST /api/admin/experiences - Protected
func (h *ExperienceHandler) CreateExperience(c *gin.Context) {
    var req models.ExperienceRequest

    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "success": false,
            "error":   "Invalid experience data",
        })
        return
    }

    // Parse dates
    startDate, _ := time.Parse("2006-01-02", req.StartDate)
    
    experience := models.Experience{
        Company:      req.Company,
        Position:     req.Position,
        Description:  req.Description,
        Location:     req.Location,
        StartDate:    startDate,
        Current:      req.Current,
        Achievements: req.Achievements,
        CompanyLogo:  req.CompanyLogo,
        CreatedAt:    time.Now(),
        UpdatedAt:    time.Now(),
    }

    if !req.Current && req.EndDate != "" {
        endDate, _ := time.Parse("2006-01-02", req.EndDate)
        experience.EndDate = &endDate
    }

    result := h.DB.Create(&experience)
    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "success": false,
            "error":   "Failed to create experience",
        })
        return
    }

    c.JSON(http.StatusCreated, gin.H{
        "success":    true,
        "message":    "Experience created successfully",
        "experience": experience,
    })
}

// PUT /api/admin/experiences/:id - Protected
func (h *ExperienceHandler) UpdateExperience(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "success": false,
            "error":   "Invalid ID",
        })
        return
    }

    var req models.ExperienceRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "success": false,
            "error":   "Invalid experience data",
        })
        return
    }

    var experience models.Experience
    result := h.DB.First(&experience, id)
    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{
            "success": false,
            "error":   "Experience not found",
        })
        return
    }

    // Update fields
    startDate, _ := time.Parse("2006-01-02", req.StartDate)
    
    updates := map[string]interface{}{
        "Company":     req.Company,
        "Position":    req.Position,
        "Description": req.Description,
        "Location":    req.Location,
        "StartDate":   startDate,
        "Current":     req.Current,
        "Achievements": req.Achievements,
        "CompanyLogo": req.CompanyLogo,
        "UpdatedAt":   time.Now(),
    }

    if !req.Current && req.EndDate != "" {
        endDate, _ := time.Parse("2006-01-02", req.EndDate)
        updates["EndDate"] = &endDate
    } else {
        updates["EndDate"] = nil
    }

    h.DB.Model(&experience).Updates(updates)

    c.JSON(http.StatusOK, gin.H{
        "success":    true,
        "message":    "Experience updated successfully",
        "experience": experience,
    })
}

// DELETE /api/admin/experiences/:id - Protected
func (h *ExperienceHandler) DeleteExperience(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "success": false,
            "error":   "Invalid ID",
        })
        return
    }

    result := h.DB.Delete(&models.Experience{}, id)
    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "success": false,
            "error":   "Failed to delete experience",
        })
        return
    }

    if result.RowsAffected == 0 {
        c.JSON(http.StatusNotFound, gin.H{
            "success": false,
            "error":   "Experience not found",
        })
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "success": true,
        "message": "Experience deleted successfully",
    })
}