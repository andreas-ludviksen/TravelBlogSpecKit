/**
 * Post Renderer Component
 * Feature: 004-modular-blog-posts
 * 
 * Renders a blog post with the selected template
 */

'use client';

import dynamic from 'next/dynamic';
import { type Photo } from './PhotoList';
import { type Video } from './VideoList';
import { type TextBlock } from './TextEditor';

// Dynamically import templates (will be created in Phase 4)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const templates: Record<string, any> = {
  '1': dynamic(() => import('@/components/templates/Template01').catch(() => DefaultTemplate)),
  '2': dynamic(() => import('@/components/templates/Template02').catch(() => DefaultTemplate)),
  '3': dynamic(() => import('@/components/templates/Template03').catch(() => DefaultTemplate)),
  '4': dynamic(() => import('@/components/templates/Template04').catch(() => DefaultTemplate)),
  '5': dynamic(() => import('@/components/templates/Template05').catch(() => DefaultTemplate)),
  '6': dynamic(() => import('@/components/templates/Template06').catch(() => DefaultTemplate)),
  '7': dynamic(() => import('@/components/templates/Template07').catch(() => DefaultTemplate)),
  '8': dynamic(() => import('@/components/templates/Template08').catch(() => DefaultTemplate)),
  '9': dynamic(() => import('@/components/templates/Template09').catch(() => DefaultTemplate)),
  '10': dynamic(() => import('@/components/templates/Template10').catch(() => DefaultTemplate)),
  // Also map full template IDs (template-01, template-02, etc.)
  'template-01': dynamic(() => import('@/components/templates/Template01').catch(() => DefaultTemplate)),
  'template-02': dynamic(() => import('@/components/templates/Template02').catch(() => DefaultTemplate)),
  'template-03': dynamic(() => import('@/components/templates/Template03').catch(() => DefaultTemplate)),
  'template-04': dynamic(() => import('@/components/templates/Template04').catch(() => DefaultTemplate)),
  'template-05': dynamic(() => import('@/components/templates/Template05').catch(() => DefaultTemplate)),
  'template-06': dynamic(() => import('@/components/templates/Template06').catch(() => DefaultTemplate)),
  'template-07': dynamic(() => import('@/components/templates/Template07').catch(() => DefaultTemplate)),
  'template-08': dynamic(() => import('@/components/templates/Template08').catch(() => DefaultTemplate)),
  'template-09': dynamic(() => import('@/components/templates/Template09').catch(() => DefaultTemplate)),
  'template-10': dynamic(() => import('@/components/templates/Template10').catch(() => DefaultTemplate)),
};

interface BlogPost {
  id: string;
  title: string;
  description: string | null;
  coverImage: string | null;
  templateId: string;
  createdAt: string;
  publishedAt: string | null;
}

interface PostContent {
  photos: Photo[];
  videos: Video[];
  textBlocks: TextBlock[];
}

interface PostRendererProps {
  post: BlogPost;
  content: PostContent;
}

// Default template fallback
function DefaultTemplate({ post, content }: PostRendererProps) {
  // Sort content by displayOrder
  const sortedPhotos = [...content.photos].sort((a, b) => a.displayOrder - b.displayOrder);
  const sortedVideos = [...content.videos].sort((a, b) => a.displayOrder - b.displayOrder);
  const sortedTextBlocks = [...content.textBlocks].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {post.title}
        </h1>
        {post.description && (
          <p className="text-xl text-gray-600">{post.description}</p>
        )}
        <div className="mt-4 text-sm text-gray-500">
          {post.publishedAt && (
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          )}
        </div>
      </header>

      {post.coverImage && (
        <div className="mb-12 aspect-video rounded-lg overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="space-y-8">
        {/* Photos */}
        {sortedPhotos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedPhotos.map(photo => (
              <div key={photo.id} className="aspect-square rounded-lg overflow-hidden">
                <img
                  src={photo.url}
                  alt={photo.altText}
                  className="w-full h-full object-cover"
                />
                {photo.caption && (
                  <p className="mt-2 text-sm text-gray-600">{photo.caption}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Videos */}
        {sortedVideos.length > 0 && (
          <div className="space-y-6">
            {sortedVideos.map(video => (
              <div key={video.id}>
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <video
                    src={video.url}
                    controls
                    className="w-full h-full"
                    poster={video.thumbnailUrl || undefined}
                  />
                </div>
                {video.caption && (
                  <p className="mt-2 text-sm text-gray-600">{video.caption}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Text Blocks */}
        {sortedTextBlocks.length > 0 && (
          <div className="prose prose-lg max-w-none">
            {sortedTextBlocks.map(block => (
              <div 
                key={block.id}
                dangerouslySetInnerHTML={{ __html: block.content }}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export default function PostRenderer({ post, content }: PostRendererProps) {
  // Sort content by displayOrder to ensure correct ordering
  const sortedContent = {
    photos: [...content.photos].sort((a, b) => a.displayOrder - b.displayOrder),
    videos: [...content.videos].sort((a, b) => a.displayOrder - b.displayOrder),
    textBlocks: [...content.textBlocks].sort((a, b) => a.displayOrder - b.displayOrder),
  };

  // Get the template component
  const TemplateComponent = templates[post.templateId] || DefaultTemplate;

  return <TemplateComponent post={post} content={sortedContent} />;
}
