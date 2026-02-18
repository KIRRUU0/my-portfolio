package handlers

import (
    "net/http"
    "strconv"
    "time"
    "strings"
    "github.com/gin-gonic/gin"
    "gorm.io/gorm"
    "myportfolio-backend/models"
)

type CategoryHandler struct {
    DB *gorm.DB
}

// GET /api/categories - Public
func (h *CategoryHandler) GetCategories(c *gin.Context) {
    var categories []models.Category
    
    result := h.DB.Find(&categories)
    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "success": false,
            "error":   "Failed to fetch categories",
        })
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "success":    true,
        "categories": categories,
    })
}

// GET /api/categories/:slug - Public
func (h *CategoryHandler) GetCategoryBySlug(c *gin.Context) {
    slug := c.Param("slug")
    
    var category models.Category
    result := h.DB.Where("slug = ?", slug).First(&category)
    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{
            "success": false,
            "error":   "Category not found",
        })
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "success":  true,
        "category": category,
    })
}

// POST /api/admin/categories - Protected
func (h *CategoryHandler) CreateCategory(c *gin.Context) {
    var req models.CategoryRequest

    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "success": false,
            "error":   "Invalid category data",
        })
        return
    }

    // Generate slug
    slug := strings.ToLower(strings.ReplaceAll(req.Name, " ", "-"))

    category := models.Category{
        Name:        req.Name,
        Slug:        slug,
        Description: req.Description,
        Color:       req.Color,
        Icon:        req.Icon,
        CreatedAt:   time.Now(),
        UpdatedAt:   time.Now(),
    }

    result := h.DB.Create(&category)
    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "success": false,
            "error":   "Failed to create category",
        })
        return
    }

    c.JSON(http.StatusCreated, gin.H{
        "success":  true,
        "message":  "Category created successfully",
        "category": category,
    })
}

// PUT /api/admin/categories/:id - Protected
func (h *CategoryHandler) UpdateCategory(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "success": false,
            "error":   "Invalid ID",
        })
        return
    }

    var req models.CategoryRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "success": false,
            "error":   "Invalid category data",
        })
        return
    }

    var category models.Category
    result := h.DB.First(&category, id)
    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{
            "success": false,
            "error":   "Category not found",
        })
        return
    }

    updates := map[string]interface{}{
        "Name":        req.Name,
        "Slug":        strings.ToLower(strings.ReplaceAll(req.Name, " ", "-")),
        "Description": req.Description,
        "Color":       req.Color,
        "Icon":        req.Icon,
        "UpdatedAt":   time.Now(),
    }

    h.DB.Model(&category).Updates(updates)

    c.JSON(http.StatusOK, gin.H{
        "success":  true,
        "message":  "Category updated successfully",
        "category": category,
    })
}

// DELETE /api/admin/categories/:id - Protected
func (h *CategoryHandler) DeleteCategory(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "success": false,
            "error":   "Invalid ID",
        })
        return
    }

    // Check if category is used by any project
    var count int64
    h.DB.Table("project_categories").Where("category_id = ?", id).Count(&count)
    if count > 0 {
        c.JSON(http.StatusBadRequest, gin.H{
            "success": false,
            "error":   "Category is used by projects and cannot be deleted",
        })
        return
    }

    result := h.DB.Delete(&models.Category{}, id)
    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "success": false,
            "error":   "Failed to delete category",
        })
        return
    }

    if result.RowsAffected == 0 {
        c.JSON(http.StatusNotFound, gin.H{
            "success": false,
            "error":   "Category not found",
        })
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "success": true,
        "message": "Category deleted successfully",
    })
}