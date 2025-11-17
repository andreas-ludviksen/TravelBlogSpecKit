/**
 * Blog Post Detail Page
 * Feature: 005-public-blog-viewing
 * 
 * Displays individual blog post with full content
 */

import PostDetailClient from './PostDetailClient';

// Generate static params at build time
// Note: Since we use client-side rendering, we return a placeholder path
// Cloudflare Pages will serve the client bundle for all /blog/* routes
export async function generateStaticParams() {
  // Return at least one path to satisfy Next.js static export requirements
  // The actual page is client-side rendered, so this is just a placeholder
  return [{ slug: '404-placeholder' }];
}

// This tells Next.js that paths not in generateStaticParams should still be rendered
export const dynamicParams = true;

export default function BlogPostPage() {
  return <PostDetailClient />;
}
