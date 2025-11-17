/**
 * Cloudflare Pages Function for dynamic blog post routes
 * This serves the 404-placeholder.html for any /blog/:slug route
 * The client-side React code will handle fetching the actual post data
 */

export async function onRequest(context: any) {
  const { request } = context;
  const url = new URL(request.url);
  
  // Construct URL to the placeholder file
  const placeholderUrl = new URL('/blog/404-placeholder.html', url.origin);
  
  // Fetch the static HTML file
  const response = await fetch(placeholderUrl.toString());
  
  if (!response.ok) {
    return new Response('Page not found', { status: 404 });
  }
  
  // Return the HTML with 200 status
  return new Response(await response.text(), {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
