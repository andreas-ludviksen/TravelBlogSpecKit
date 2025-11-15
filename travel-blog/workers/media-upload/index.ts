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

const router = Router({ base: '/api/media' });

// Upload photo to Cloudflare Images
router.post('/upload-photo', uploadPhoto);

// Upload video to Cloudflare R2
router.post('/upload-video', uploadVideo);

// Validate external media URL
router.post('/validate-url', validateUrl);

// 404 handler
router.all('*', () => errorResponse('Not Found', 'The requested resource was not found', 404));

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      return await router.handle(request, env, ctx);
    } catch (error) {
      return handleError(error);
    }
  },
};
