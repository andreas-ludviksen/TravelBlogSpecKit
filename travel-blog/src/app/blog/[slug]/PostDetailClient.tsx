/**
 * Blog Post Detail Client Component
 * Feature: 005-public-blog-viewing
 * 
 * Client-side component for fetching and displaying blog post details
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchPostBySlug, type PostDetailResponse } from '@/lib/posts-api';
import PostRenderer from '@/components/blog/PostRenderer';
import BackToList from '@/components/blog/BackToList';
import PostNavigation from '@/components/blog/PostNavigation';
import { formatPostDate } from '@/utils/date-format';

export default function PostDetailClient() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [postData, setPostData] = useState<PostDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPost() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchPostBySlug(slug);
        
        // Only show published posts
        if (data.post.status !== 'published') {
          router.push('/blog');
          return;
        }
        
        setPostData(data);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load blog post');
      } finally {
        setIsLoading(false);
      }
    }

    loadPost();
  }, [slug, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !postData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <BackToList />
          <div className="mt-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
            <p className="text-gray-600">{error || 'The requested blog post could not be found.'}</p>
          </div>
        </div>
      </div>
    );
  }

  const { post, content } = postData;
  const publishDate = formatPostDate(post.publishedAt, 'long');

  return (
    <div className="min-h-screen bg-gray-50">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back button */}
        <BackToList />

        {/* Post header */}
        <header className="mb-8">
          <div className="mb-4">
            <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full">
              {post.templateName}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>

          {post.description && (
            <p className="text-xl text-gray-600 mb-4">
              {post.description}
            </p>
          )}

          <div className="flex items-center text-sm text-gray-500">
            <time dateTime={post.publishedAt || post.createdAt}>
              {publishDate}
            </time>
          </div>
        </header>

        {/* Post content rendered with template */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <PostRenderer post={post} content={content} />
        </div>

        {/* Post navigation (prev/next) - TODO: implement in future iteration */}
        <PostNavigation />
      </article>
    </div>
  );
}
