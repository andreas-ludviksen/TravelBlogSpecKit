/**
 * Main Cloudflare Workers entry point
 * Routes authentication requests to appropriate handlers
 */

import { Router } from 'itty-router';
import { handleCORSPreflight, addCORSHeaders } from '../lib/cors';
import type { Env } from '../types';

// Import route handlers (will be implemented next)
import { handleLogin } from './login';
import { handleLogout } from './logout';
import { handleVerify } from './verify-session';

// Create router instance
const router = Router();

/**
 * Health check endpoint
 */
router.get('/api/auth/health', () => {
  return new Response(JSON.stringify({ status: 'ok', service: 'auth' }), {
    headers: { 'Content-Type': 'application/json' },
  });
});

/**
 * Authentication endpoints
 */
router.post('/api/auth/login', handleLogin);
router.post('/api/auth/logout', handleLogout);
router.get('/api/auth/verify', handleVerify);

/**
 * Handle OPTIONS preflight requests for CORS
 */
router.options('*', (request) => handleCORSPreflight(request));

/**
 * 404 handler for unknown routes
 */
router.all('*', () => {
  return new Response(
    JSON.stringify({
      success: false,
      error: 'NOT_FOUND',
      message: 'Endpoint not found',
    }),
    {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    }
  );
});

/**
 * Main Workers fetch handler
 * Exported as default for Cloudflare Workers runtime
 */
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      // Route the request
      const response = await router.handle(request, env, ctx);
      
      // Add CORS headers to response
      return addCORSHeaders(response, request);
    } catch (error) {
      console.error('Unhandled error in worker:', error);
      
      const errorResponse = new Response(
        JSON.stringify({
          success: false,
          error: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
      
      return addCORSHeaders(errorResponse, request);
    }
  },
};
