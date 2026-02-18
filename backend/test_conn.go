package main

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func testConn() {
	godotenv.Load()

	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	pass := os.Getenv("DB_PASSWORD")
	name := os.Getenv("DB_NAME")
	ssl := os.Getenv("DB_SSLMODE")

	// Coba format 1
	dsn1 := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
		host, user, pass, name, port, ssl)

	fmt.Println("Mencoba koneksi dengan DSN:", dsn1)

	_, err := gorm.Open(postgres.Open(dsn1), &gorm.Config{})
	if err != nil {
		fmt.Println("Gagal:", err)
	} else {
		fmt.Println("Berhasil!")
		return
	}

	// Coba format 2 (dengan project param)
	dsn2 := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s options=project%%3Dirjpaflfnzzxyouoznal",
		host, "postgres", pass, "postgres", port, ssl)

	fmt.Println("\nMencoba koneksi dengan DSN:", dsn2)

	_, err = gorm.Open(postgres.Open(dsn2), &gorm.Config{})
	if err != nil {
		fmt.Println("Gagal:", err)
	} else {
		fmt.Println("Berhasil!")
	}
}
