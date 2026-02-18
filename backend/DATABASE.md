# Database Setup Guide

## Prerequisites
- MySQL installed (version 5.7 or higher)
- MySQL running on localhost:3306

## Installation

### 1. Install MySQL (if not installed)
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mysql-server

# Start MySQL
sudo systemctl start mysql
sudo systemctl enable mysql

# Secure installation
sudo mysql_secure_installation