/**
 * Cloudflare Pages Function to handle dynamic blog post routes
 * Serves the same HTML for all /blog/:slug routes to enable client-side routing
 */

export async function onRequest(context) {
  // Serve the blog list page HTML which contains the React app
  // The React app will handle routing and fetch the specific post client-side
  const url = new URL(context.request.url);
  const newUrl = new URL('/blog', url.origin);
  
  const response = await context.env.ASSETS.fetch(newUrl);
  
  // Return the HTML with a 200 status
  return new Response(response.body, {
    status: 200,
    headers: response.headers,
  });
}
