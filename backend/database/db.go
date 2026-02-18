package database

import (
    "fmt"
    "log"
    "os"
    "myportfolio-backend/models"
    "golang.org/x/crypto/bcrypt"
    "gorm.io/driver/mysql"
    "gorm.io/gorm"
    "gorm.io/gorm/logger"
)

var DB *gorm.DB

func Connect() {
    log.Println("Attempting to connect to database...")
    // Ambil konfigurasi dari environment
    dbHost := os.Getenv("DB_HOST")
    dbPort := os.Getenv("DB_PORT")
    dbUser := os.Getenv("DB_USER")
    dbPass := os.Getenv("DB_PASSWORD")
    dbName := os.Getenv("DB_NAME")

    // Buat DSN untuk MySQL
    // format: username:password@tcp(host:port)/dbname?charset=utf8mb4&parseTime=True&loc=Local
    dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
        dbUser, dbPass, dbHost, dbPort, dbName)

    // Koneksi ke database
    var err error
    DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{
        Logger: logger.Default.LogMode(logger.Info),
    })

    if err != nil {
        log.Fatal("❌ Failed to connect to MySQL:", err)
    }

    if err != nil {
        log.Fatal("❌ Failed to connect to database:", err) // PASTIKAN INI LOG.FATAL
    }

    log.Println("✅ Connected to MySQL successfully!")
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