package utils

import (
    "regexp"
    "strings"
)

// GenerateSlug membuat slug dari string
func GenerateSlug(text string) string {
    if text == "" {
        return "untitled"
    }
    
    // Convert to lowercase
    slug := strings.ToLower(text)
    
    // Replace spaces with dash
    slug = strings.ReplaceAll(slug, " ", "-")
    
    // Remove special characters
    reg := regexp.MustCompile("[^a-z0-9-]+")
    slug = reg.ReplaceAllString(slug, "")
    
    // Remove multiple dashes
    reg = regexp.MustCompile("-+")
    slug = reg.ReplaceAllString(slug, "-")
    
    // Trim dashes from ends
    slug = strings.Trim(slug, "-")
    
    return slug
}