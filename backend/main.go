package main

import (
	"log"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"myportfolio-backend/database"
	"myportfolio-backend/handlers"
	"myportfolio-backend/middleware"
	"myportfolio-backend/services"
    
)

func main() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found, using environment variables")
	}

	// Connect to database (Supabase)
	database.Connect()
	database.Migrate()

    // Initialize Storage Service
    storageService, err := services.NewStorageService()
    if err != nil {
        log.Fatalf("❌ CRITICAL: Failed to initialize storage service: %v", err) // Hentikan program
    }
    // Inisialisasi buckets
    if err := storageService.InitBuckets(); err != nil {
        log.Printf("Warning: Failed to init buckets: %v", err)
    } else {
        log.Println("✅ Supabase Storage initialized")
    }

    // Initialize handlers with database AND storage
    authHandler := &handlers.AuthHandler{DB: database.DB}
    projectHandler := &handlers.ProjectHandler{DB: database.DB, Storage: storageService}
    experienceHandler := &handlers.ExperienceHandler{DB: database.DB}
    categoryHandler := &handlers.CategoryHandler{DB: database.DB}
    contactHandler := &handlers.ContactHandler{DB: database.DB}
    certificateHandler := &handlers.CertificateHandler{DB: database.DB, Storage: storageService}

	// Initialize router
	router := gin.Default()

	// CORS configuration
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5176", "https://my-portfolio-sigma-murex-62.vercel.app"},
		AllowMethods:     []string{"*"},
		AllowHeaders:     []string{"*"},
		ExposeHeaders:    []string{"Content-Length", "Content-Type"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Serve static files
	router.Static("/uploads", "./uploads")

	// Public routes
	public := router.Group("/api")
	{
		public.POST("/login", authHandler.Login)
		public.POST("/contact", contactHandler.SubmitContact)
		public.GET("/projects", projectHandler.GetProjects)
		public.GET("/projects/:slug", projectHandler.GetProjectBySlug)
		public.GET("/experiences", experienceHandler.GetExperiences)
		public.GET("/categories", categoryHandler.GetCategories)
		public.GET("/categories/:slug", categoryHandler.GetCategoryBySlug)
		public.GET("/certificates", certificateHandler.GetCertificates)
		public.GET("/certificates/:id", certificateHandler.GetCertificate)
	}

	// Protected routes
	protected := router.Group("/api/admin")
	protected.Use(middleware.AuthMiddleware())
	{
		// Projects
		protected.POST("/projects", projectHandler.CreateProject)
		protected.PUT("/projects/:id", projectHandler.UpdateProject)
		protected.DELETE("/projects/:id", projectHandler.DeleteProject)
		protected.POST("/projects/upload-image", projectHandler.UploadImage)

		// Experiences
		protected.POST("/experiences", experienceHandler.CreateExperience)
		protected.PUT("/experiences/:id", experienceHandler.UpdateExperience)
		protected.DELETE("/experiences/:id", experienceHandler.DeleteExperience)

		// Categories
		protected.POST("/categories", categoryHandler.CreateCategory)
		protected.PUT("/categories/:id", categoryHandler.UpdateCategory)
		protected.DELETE("/categories/:id", categoryHandler.DeleteCategory)

		// Certificates
		protected.POST("/certificates", certificateHandler.CreateCertificate)
		protected.PUT("/certificates/:id", certificateHandler.UpdateCertificate)
		protected.DELETE("/certificates/:id", certificateHandler.DeleteCertificate)
		protected.POST("/certificates/upload-image", certificateHandler.UploadImage)

		// Contacts
		protected.GET("/contacts", contactHandler.GetMessages)
		protected.GET("/contacts/stats", contactHandler.GetStats)
		protected.GET("/contacts/:id", contactHandler.GetMessageDetail)
		protected.POST("/contacts/:id/reply", contactHandler.MarkAsReplied)
		protected.DELETE("/contacts/:id", contactHandler.DeleteMessage)
		protected.POST("/contacts/bulk", contactHandler.BulkAction)

		// Token validation
		protected.GET("/validate", authHandler.ValidateToken)
	}

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 Server running on http://localhost:%s", port)
	router.Run(":" + port)
}
