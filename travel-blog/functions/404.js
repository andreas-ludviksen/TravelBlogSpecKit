/**
 * Custom 404 handler for Cloudflare Pages
 * Redirects /blog/:slug routes to the blog page for client-side routing
 */

export async function onRequest(context) {
  const url = new URL(context.request.url);
  
  // If the request is for a blog post, serve the blog page HTML
  if (url.pathname.startsWith('/blog/') && url.pathname !== '/blog/') {
    const blogPageUrl = new URL('/blog', url.origin);
    const response = await context.env.ASSETS.fetch(blogPageUrl);
    
    // Return with 200 status
    return new Response(response.body, {
      status: 200,
      headers: response.headers,
    });
  }
  
  // For other 404s, return standard 404
  return new Response('Not Found', { status: 404 });
}
