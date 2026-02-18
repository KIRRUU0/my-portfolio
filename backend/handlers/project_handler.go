package handlers

import (
	"myportfolio-backend/models"
	"myportfolio-backend/services"
	"myportfolio-backend/utils"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type ProjectHandler struct {
	DB      *gorm.DB
	Storage *services.StorageService
}

// GET /api/projects - Public
func (h *ProjectHandler) GetProjects(c *gin.Context) {
	var projects []models.Project

	// Ambil query params
	category := c.Query("category")
	featured := c.Query("featured")
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))

	// Query database
	query := h.DB.Model(&models.Project{}).Where("status = ?", "published")

	if featured == "true" {
		query = query.Where("featured = ?", true)
	}

	if category != "" {
		query = query.Joins("JOIN project_categories ON project_categories.project_id = projects.id").
			Joins("JOIN categories ON categories.id = project_categories.category_id").
			Where("categories.slug = ?", category)
	}

	// Hitung total
	var total int64
	query.Count(&total)

	// Ambil data dengan preload categories
	query = query.Preload("Categories").Limit(limit).Offset(offset).Order("featured DESC, created_at DESC")
	result := query.Find(&projects)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to fetch projects",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":  true,
		"total":    total,
		"limit":    limit,
		"offset":   offset,
		"projects": projects,
	})
}

// GET /api/projects/:slug - Public
func (h *ProjectHandler) GetProjectBySlug(c *gin.Context) {
	slug := c.Param("slug")

	var project models.Project
	result := h.DB.Preload("Categories").Where("slug = ? AND status = ?", slug, "published").First(&project)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"error":   "Project not found",
		})
		return
	}

	// Increment views
	h.DB.Model(&project).Update("views", project.Views+1)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"project": project,
	})
}

// POST /api/admin/projects - Protected
func (h *ProjectHandler) CreateProject(c *gin.Context) {
	var req models.ProjectRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid project data",
		})
		return
	}

	// Generate slug dari title
	slug := utils.GenerateSlug(req.Title)

	// Buat project baru
	project := models.Project{
		Title:       req.Title,
		Slug:        slug,
		Description: req.Description,
		Content:     req.Content,
		ImageURL:    req.ImageURL,
		TechStack:   req.TechStack,
		GithubLink:  req.GithubLink,
		LiveLink:    req.LiveLink,
		Featured:    req.Featured,
		Status:      req.Status,
		Views:       0,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	// Simpan ke database
	result := h.DB.Create(&project)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to create project",
		})
		return
	}

	// Handle categories jika ada
	if len(req.CategoryIDs) > 0 {
		var categories []models.Category
		h.DB.Find(&categories, req.CategoryIDs)
		h.DB.Model(&project).Association("Categories").Append(categories)
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Project created successfully",
		"project": project,
	})
}

// PUT /api/admin/projects/:id - Protected
func (h *ProjectHandler) UpdateProject(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid ID",
		})
		return
	}

	var req models.ProjectRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid project data",
		})
		return
	}

	// Cari project
	var project models.Project
	result := h.DB.First(&project, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"error":   "Project not found",
		})
		return
	}

	// Update fields
	updates := map[string]interface{}{
		"Title":       req.Title,
		"Description": req.Description,
		"Content":     req.Content,
		"ImageURL":    req.ImageURL,
		"TechStack":   req.TechStack,
		"GithubLink":  req.GithubLink,
		"LiveLink":    req.LiveLink,
		"Featured":    req.Featured,
		"Status":      req.Status,
		"UpdatedAt":   time.Now(),
	}

	// Update slug jika title berubah
	if req.Title != project.Title {
		updates["Slug"] = utils.GenerateSlug(req.Title)
	}

	// Update database
	h.DB.Model(&project).Updates(updates)

	// Update categories
	if len(req.CategoryIDs) > 0 {
		var categories []models.Category
		h.DB.Find(&categories, req.CategoryIDs)
		h.DB.Model(&project).Association("Categories").Replace(categories)
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Project updated successfully",
		"project": project,
	})
}

// DELETE /api/admin/projects/:id - Protected
func (h *ProjectHandler) DeleteProject(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid ID",
		})
		return
	}

	// Hapus project
	result := h.DB.Delete(&models.Project{}, id)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to delete project",
		})
		return
	}

	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"error":   "Project not found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Project deleted successfully",
	})
}

// POST /api/admin/projects/upload-image - Protected
func (h *ProjectHandler) UploadImage(c *gin.Context) {
    file, err := c.FormFile("image")
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "success": false,
            "error":   "No file uploaded",
        })
        return
    }

    // Validasi ukuran (max 10MB)
    if file.Size > 10<<20 {
        c.JSON(http.StatusBadRequest, gin.H{
            "success": false,
            "error":   "File too large (max 10MB)",
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
    imageURL, err := h.Storage.UploadFile(h.Storage.ProjectsBucket, src, file.Filename)
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
