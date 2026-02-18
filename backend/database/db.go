package database

import (
    "fmt"
    "log"
    "os"
    "myportfolio-backend/models"
    "golang.org/x/crypto/bcrypt"
    "gorm.io/driver/postgres"
    "gorm.io/gorm"
    "gorm.io/gorm/logger"
)

var DB *gorm.DB

func Connect() {
    log.Println("🔌 Attempting to connect to database...")
    
    // Ambil konfigurasi dari environment
    dbHost := os.Getenv("DB_HOST")
    dbPort := os.Getenv("DB_PORT")
    dbUser := os.Getenv("DB_USER")
    dbPass := os.Getenv("DB_PASSWORD")
    dbName := os.Getenv("DB_NAME")
    dbSSLMode := os.Getenv("DB_SSLMODE")

    // Log konfigurasi (tanpa password)
    log.Printf("📋 Configuration - Host: %s, Port: %s, User: %s, DB: %s, SSL: %s", 
        dbHost, dbPort, dbUser, dbName, dbSSLMode)

    // Validasi environment variables
    if dbHost == "" {
        log.Fatal("❌ DB_HOST is not set")
    }
    if dbUser == "" {
        log.Fatal("❌ DB_USER is not set")
    }
    if dbPass == "" {
        log.Fatal("❌ DB_PASSWORD is not set")
    }
    if dbName == "" {
        log.Fatal("❌ DB_NAME is not set")
    }

    // Buat DSN untuk PostgreSQL
    dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=Asia/Jakarta",
        dbHost, dbUser, dbPass, dbName, dbPort, dbSSLMode)

    log.Println("🔄 Attempting connection with DSN (hidden password)...")

    // Koneksi ke database
    var err error
    DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
        Logger: logger.Default.LogMode(logger.Info),
    })

    if err != nil {
        log.Fatal("❌ Failed to connect to database:", err)
    }

    log.Println("✅ Connected to database successfully!")
}

func Migrate() {
    // Auto migrate schema
    err := DB.AutoMigrate(
        &models.User{},
        &models.Project{},
        &models.Experience{},
        &models.Category{},
        &models.ContactMessage{},
        &models.Certificate{},
    )

    if err != nil {
        log.Fatal("❌ Failed to migrate database:", err)
    }

    log.Println("✅ Database migration completed!")

    // Create default admin user if not exists
    CreateDefaultAdmin()
}

func CreateDefaultAdmin() {
    var count int64
    DB.Model(&models.User{}).Count(&count)

    if count == 0 {
        // Hash password
        hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)

        admin := models.User{
            Username: "admin",
            Password: string(hashedPassword),
        }

        DB.Create(&admin)
        log.Println("✅ Default admin user created! (admin/admin123)")
    }
}