/**
 * Media Upload Router
 * Feature: 004-modular-blog-posts
 * 
 * Routes:
 * - POST /api/media/upload-photo
 * - POST /api/media/upload-video
 * - POST /api/media/validate-url
 */

import { Router } from 'itty-router';
import { uploadPhoto } from './upload-photo';
import { uploadVideo } from './upload-video';
import { validateUrl } from './validate-url';
import { errorResponse, handleError } from '../lib/errors';

interface Env {
  DB: D1Database;
  MEDIA_BUCKET: R2Bucket;
  CLOUDFLARE_ACCOUNT_ID: string;
  CLOUDFLARE_IMAGES_API_TOKEN: string;
  JWT_SECRET: string;
}

const router = Router();

// Health check endpoint
router.get('/api/media/health', () => {
  return new Response(JSON.stringify({ status: 'ok', service: 'media-upload' }), {
    headers: { 'Content-Type': 'application/json' }
  });
});

// Upload photo to Cloudflare Images
router.post('/api/media/upload-photo', uploadPhoto);

// Upload video to Cloudflare R2
router.post('/api/media/upload-video', uploadVideo);

// Validate external media URL
router.post('/api/media/validate-url', validateUrl);

// 404 handler
router.all('*', () => errorResponse('Not Found', 'The requested resource was not found', 404));

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      const response = await router.fetch(request, env, ctx);
      return response || new Response('Not Found', { status: 404 });
    } catch (error) {
      console.error('Media worker error:', error);
      return handleError(error);
    }
  },
};
