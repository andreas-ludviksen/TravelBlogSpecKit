/**
 * Create Text Block Endpoint
 * Feature: 004-modular-blog-posts
 * POST /api/posts/:postId/text
 * 
 * Creates a new text block for a blog post
 */

import { createDatabaseClient } from '../lib/db';
import { generateUUID } from '../lib/uuid';
import { withAuth } from '../lib/auth-middleware';
import type { SessionPayload } from '../lib/jwt';
import { 
  NotFoundError,
  UnauthorizedError,
  ValidationError, 
  ServerError,
  successResponse,
  parseJsonBody 
} from '../lib/errors';

interface Env {
  DB: D1Database;
  JWT_SECRET: string;
}

interface CreateTextRequest {
  content: string;
  displayOrder?: number;
}

export const createText = withAuth(async (request: Request & { params?: any }, user, env: Env, params: any) => {
  try {
    // itty-router puts params on the request object
    const routeParams = (request as any).params || params;
    const { postId } = routeParams;

    console.log('[createText] postId from params:', postId);
    console.log('[createText] request.params:', (request as any).params);
    console.log('[createText] params arg:', params);

    if (!postId) {
      throw new NotFoundError('Post not found');
    }

    const body = await parseJsonBody<CreateTextRequest>(request);

    // Validate required fields
    if (!body.content || typeof body.content !== 'string') {
      throw new ValidationError('content is required and must be a string');
    }

    const db = createDatabaseClient(env.DB);

    // Check post ownership
    const post = await db.queryOne(
      'SELECT author_id FROM blog_posts WHERE id = ?',
      [postId]
    );

    if (!post) {
      throw new NotFoundError('Post not found');
    }

    if (post.author_id !== user.sub) {
      throw new UnauthorizedError('You do not have permission to add text to this post');
    }

    // Determine display order
    let displayOrder = body.displayOrder ?? 0;
    if (displayOrder === undefined || displayOrder === null) {
      // Get max display order and add 1
      const maxOrder = await db.queryOne(
        'SELECT MAX(display_order) as max_order FROM text_content WHERE post_id = ?',
        [postId]
      );
      displayOrder = (maxOrder?.max_order ?? -1) + 1;
    }

    // Create text block
    const textId = generateUUID();
    const now = new Date().toISOString();

    await db.execute(
      `INSERT INTO text_content (id, post_id, content, display_order, section_name, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [textId, postId, body.content, displayOrder, 'main', now]
    );

    // Update post's updated_at
    await db.execute(
      'UPDATE blog_posts SET updated_at = ? WHERE id = ?',
      [now, postId]
    );

    // Return response
    return successResponse({
      textId,
      content: body.content,
      displayOrder,
      createdAt: now,
    }, 201);

  } catch (error) {
    console.error('Create text block error:', error);
    
    if (error instanceof NotFoundError || error instanceof UnauthorizedError || 
        error instanceof ValidationError) {
      throw error;
    }
    
    throw new ServerError('Failed to create text block');
  }
});
