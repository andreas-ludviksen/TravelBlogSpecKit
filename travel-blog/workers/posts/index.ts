/**
 * Blog Posts Router
 * Feature: 004-modular-blog-posts
 * 
 * Routes:
 * - POST /api/posts/create
 * - GET /api/posts/:postId
 * - GET /api/posts
 * - DELETE /api/posts/:postId
 * - PATCH /api/posts/:postId
 * - PUT /api/posts/:postId/photos/:photoId
 * - DELETE /api/posts/:postId/photos/:photoId
 * - PUT /api/posts/:postId/videos/:videoId
 * - DELETE /api/posts/:postId/videos/:videoId
 * - PUT /api/posts/:postId/text/:textId
 * - DELETE /api/posts/:postId/text/:textId
 * - POST /api/posts/:postId/reorder
 */

import { Router } from 'itty-router';
import { createPost } from './create-post';
import { getPost } from './get-post';
import { listPosts } from './list-posts';
import { deletePost } from './delete-post';
import { updateMetadata } from './update-metadata';
import { updatePhoto } from './update-photo';
import { deletePhoto } from './delete-photo';
import { updateVideo } from './update-video';
import { deleteVideo } from './delete-video';
import { updateText } from './update-text';
import { deleteText } from './delete-text';
import { reorderContent } from './reorder';
import { errorResponse, handleError } from '../lib/errors';

interface Env {
  DB: D1Database;
  MEDIA_BUCKET: R2Bucket;
  CLOUDFLARE_ACCOUNT_ID: string;
  CLOUDFLARE_IMAGES_API_TOKEN: string;
  JWT_SECRET: string;
}

const router = Router({ base: '/api/posts' });

// Create new blog post
router.post('/create', createPost);

// List blog posts
router.get('/', listPosts);

// Get single blog post
router.get('/:postId', getPost);

// Update post metadata
router.patch('/:postId', updateMetadata);

// Delete blog post
router.delete('/:postId', deletePost);

// Reorder content
router.post('/:postId/reorder', reorderContent);

// Photo content management
router.put('/:postId/photos/:photoId', updatePhoto);
router.delete('/:postId/photos/:photoId', deletePhoto);

// Video content management
router.put('/:postId/videos/:videoId', updateVideo);
router.delete('/:postId/videos/:videoId', deleteVideo);

// Text content management
router.put('/:postId/text/:textId', updateText);
router.delete('/:postId/text/:textId', deleteText);

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
