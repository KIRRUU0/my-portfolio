-- Buat database
CREATE DATABASE IF NOT EXISTS portfolio_db;
USE portfolio_db;

-- User akan dibuat otomatis oleh GORM
-- Tapi kita bisa buat manual jika perlu

-- Tampilkan semua tabel setelah migrasi
SHOW TABLES;