# Feature Specification: Authenticated Blog Viewing

**Feature Branch**: `005-public-blog-viewing`  
**Created**: 2025-11-16  
**Updated**: 2025-11-17
**Status**: Draft  
**Priority**: P1 (Critical - MVP completion)  
**Input**: User need: "Authenticated readers need to be able to browse and view published blog posts that contributors have created"

## Context

This feature completes the MVP by adding the authenticated blog viewing experience. Feature 004 (Modular Blog Posts) implemented the contributor workflow for creating and publishing posts, but currently there is no way for authenticated readers to browse or view those published posts.

This is a **private family travel blog** where only authenticated users with "reader" or "contributor" roles can view published posts. Public access is not allowed.

**Dependencies**: 
- Feature 003 (User Authentication) - Uses session management and role-based access control
- Feature 004 (Modular Blog Posts) - Displays posts created by contributors

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse Published Blog Posts (Priority: P1)

An authenticated reader (logged in with "reader" or "contributor" role) navigates to the blog homepage and sees a list of all published blog posts with preview information (title, cover image, excerpt, date). They can browse through posts and navigate to individual post pages. Unauthenticated visitors are redirected to login.

**Why this priority**: This is essential for MVP - without it, published posts are invisible to readers. All the contributor functionality in Feature 004 has no value if readers can't view the posts.

**Independent Test**: Can be fully tested by logging in as a "reader" user, accessing the blog homepage, verifying that all published posts appear in the list with correct metadata, confirming that draft posts are not visible to readers (only to contributors/authors), and verifying that unauthenticated access redirects to login.

**Acceptance Scenarios**:

1. **Given** a user is not logged in, **When** they try to access the blog homepage, **Then** they are redirected to the login page
2. **Given** there are 5 published blog posts and 2 draft posts, **When** an authenticated "reader" navigates to the blog homepage, **Then** they see exactly 5 posts displayed with title, cover image, excerpt, and publication date
3. **Given** an authenticated reader is viewing the blog homepage, **When** they scroll down, **Then** posts load with pagination or infinite scroll to handle large numbers of posts
4. **Given** posts were published on different dates, **When** a reader views the blog homepage, **Then** posts are displayed in reverse chronological order (newest first)
5. **Given** a "contributor" is logged in, **When** they view the blog homepage, **Then** they see all published posts (same as readers)

---

### User Story 2 - View Individual Blog Post (Priority: P1)

An authenticated reader clicks on a blog post from the list and views the full post content rendered according to its selected design template, including all photos, videos, and text sections. Unauthenticated visitors trying to access post URLs directly are redirected to login.

**Why this priority**: Essential for MVP - this is the primary way readers consume blog content. Without individual post pages, readers can only see preview information.

**Independent Test**: Can be fully tested by logging in as a "reader" user, clicking on a post from the homepage, verifying that the post displays with the correct template, all content elements (photos, videos, text) render properly, navigation back to the list works correctly, and verifying that direct URL access without authentication redirects to login.

**Acceptance Scenarios**:

1. **Given** a user is not logged in, **When** they try to access a blog post URL directly, **Then** they are redirected to the login page with a redirect parameter to return to that post after login
2. **Given** an authenticated "reader" is logged in and a blog post was created with Template #3 (Photo Grid Showcase), **When** the reader clicks on that post from the homepage, **Then** the post displays with all photos arranged in Template #3's grid layout
3. **Given** a post contains 10 photos, 2 videos, and 5 text sections, **When** an authenticated reader views the post, **Then** all content displays correctly according to the template's specifications
4. **Given** an authenticated reader is viewing a blog post, **When** they want to return to browse more posts, **Then** there is clear navigation to go back to the post list

---

### Edge Cases

- What happens when an unauthenticated user tries to access the blog? Redirect to login page with redirect parameter to return after login
- What happens when there are no published posts? Display a friendly message indicating no posts are available yet (for authenticated users)
- How does the system handle very long post titles or excerpts in the list view? Truncate with ellipsis (...) after a certain character limit
- What happens if a post's cover image fails to load or doesn't exist? Display a default placeholder image
- How does the site handle direct URLs to unpublished (draft) posts? Return 404 Not Found for readers, allow access for post authors/contributors
- What happens when a reader's session expires while viewing a post? Redirect to login on next navigation or page refresh
- What happens when multiple authenticated readers view the same post simultaneously? No issue - static content, no state management needed
- How does navigation work on mobile devices with touch gestures? Ensure responsive design with proper touch targets

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST require authentication to access the blog homepage and all blog post pages
- **FR-002**: System MUST redirect unauthenticated users to the login page when they try to access blog pages
- **FR-003**: System MUST preserve the requested URL and redirect back after successful login
- **FR-004**: System MUST display a list of all published blog posts on the homepage/blog index page to authenticated users
- **FR-005**: System MUST NOT show draft or unpublished posts to "reader" role users (only published posts are visible)
- **FR-006**: System MUST allow "contributor" role users to see all published posts (same view as readers for viewing, separate UI for managing their own posts)
- **FR-007**: System MUST display posts in reverse chronological order (newest first) by default
- **FR-008**: Each post in the list MUST show: title, cover image (or placeholder), excerpt/preview text, publication date, and author name
- **FR-009**: System MUST provide pagination or infinite scroll for post lists when there are more than 10-20 posts
- **FR-010**: Authenticated users MUST be able to view individual blog post pages
- **FR-011**: Individual post pages MUST render content according to the post's selected design template
- **FR-012**: Individual post pages MUST display all content (photos, videos, text) according to template specifications (FR-016, FR-017 from Feature 004)
- **FR-013**: System MUST provide navigation from post list to individual posts and back
- **FR-014**: Post URLs MUST be SEO-friendly (e.g., `/blog/my-trip-to-iceland` instead of `/blog?id=123`)
- **FR-015**: Post list pages and individual post pages MUST be responsive and work on mobile, tablet, and desktop devices
- **FR-016**: System MUST handle missing or broken media gracefully (display placeholders for broken images/videos)
- **FR-017**: System MUST return 404 status for non-existent post URLs
- **FR-018**: System MUST redirect to login (not 404) when unauthenticated users try to access valid post URLs

### Non-Functional Requirements

- **NFR-001**: Homepage with 20 posts should load in under 2 seconds on a standard broadband connection
- **NFR-002**: Individual post pages should load in under 3 seconds, including all media (with lazy loading)
- **NFR-003**: Post list should support at least 1000 published posts without performance degradation
- **NFR-004**: All pages should achieve a Lighthouse performance score of 80+ (mobile)
- **NFR-005**: Pages should work correctly in Chrome, Firefox, Safari, and Edge (latest versions)

### Key Entities

- **Post List View**: Displays multiple posts with preview information; supports filtering and pagination
- **Post Detail View**: Displays a single post's full content using its design template
- **Post Preview Card**: Component showing post summary (title, image, excerpt) in list view
- **SEO Meta Data**: Title tags, meta descriptions, Open Graph tags for posts
- **Navigation Controls**: Components for browsing between posts and returning to list

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Authenticated readers can access the blog homepage and see all published posts within 2 seconds after login
- **SC-002**: 100% of unauthenticated access attempts to blog pages result in redirect to login
- **SC-003**: 100% of published posts are visible to authenticated readers on the homepage
- **SC-004**: 0% of draft/unpublished posts are visible to "reader" role users (verified through security testing)
- **SC-005**: Individual post pages render correctly with all content elements for 95%+ of posts across different templates
- **SC-006**: Post pages achieve Lighthouse performance score of 80+ on mobile devices (for authenticated users)
- **SC-007**: Post URLs are bookmarkable and shareable (authenticated users can share links, recipients must log in to view)
- **SC-008**: Navigation between post list and individual posts works correctly 100% of the time
- **SC-009**: Session expiry during browsing redirects to login and preserves the user's location for return after re-authentication

## Out of Scope

- Public/unauthenticated access to blog (this is a private family blog)
- SEO optimization and search engine indexing (not needed for private blog)
- Social media sharing meta tags (not applicable for authenticated-only content)
- User comments on posts (separate feature)
- Post categories/tags taxonomy (separate feature)
- Related posts recommendations (can be added later)
- Post statistics/analytics (separate feature)
- RSS feed generation (can be added later for authenticated users)
- Custom domains for blog (infrastructure concern)

## Technical Considerations

### Static Export Compatibility

Since the blog uses Next.js static export (per constitution), we need to:
1. Generate static HTML for all published posts at build time using `generateStaticParams()`
2. Fetch post list at build time (not runtime) or use client-side rendering for dynamic list
3. Handle new posts by triggering rebuilds (manual or via webhook)

### Architecture Options

**Option A: Full Static Generation (Recommended)**
- Build-time generation of all post pages
- Pros: Best performance, works offline, CDN-friendly
- Cons: Requires rebuild for new posts

**Option B: Client-Side Rendering**
- Fetch posts from API in browser
- Pros: No rebuild needed for new posts
- Cons: Slower initial page load, requires JavaScript

**Hybrid Approach**: Static homepage + client-side post detail (ISR-like behavior)

## Dependencies

### Requires from Feature 004
- Posts API: `GET /api/posts` (filter by status=published)
- Post detail API: `GET /api/posts/{postId}` (with full content)
- PostRenderer component (renders posts with templates)
- All 10 design template components
- Media content components (PhotoList, VideoList, etc.)

### Provides to Future Features
- Post browsing foundation for search/filter features
- URL structure for RSS feeds
- SEO foundation for blog growth

## Implementation Notes

### URL Structure
```
/ or /blog              → Post list (homepage)
/blog/post-slug         → Individual post
/blog?page=2            → Pagination
/blog?template=5        → Filter by template (optional)
```

### Data Flow
```
Build Time:
1. Fetch all published posts via API
2. Generate static HTML for each post
3. Generate post list page(s)

Runtime (Reader):
1. Navigate to homepage → See static post list
2. Click post → Navigate to static post page
3. View full content rendered with template
```

### API Requirements
Posts API should support:
- `GET /api/posts?status=published` → List published posts
- `GET /api/posts/{id}` → Get post with full content
- Query params: `page`, `limit`, `sortBy`, `template` (optional)
