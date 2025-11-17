-- Migration: Add metadata columns to blog_posts
-- Feature: 005-public-blog-viewing
-- Date: 2025-11-16
-- Description: Adds description and cover_image columns for public blog viewing

-- Add description column for post excerpts/summaries
ALTER TABLE blog_posts ADD COLUMN description TEXT;

-- Add cover_image column for post preview images
ALTER TABLE blog_posts ADD COLUMN cover_image TEXT;
