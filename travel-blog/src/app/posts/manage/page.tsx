/**
 * Manage Posts Page
 * Feature: Blog Post Management
 * 
 * List and delete contributor's blog posts
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  published_at?: string;
  photo_count?: number;
  video_count?: number;
  text_count?: number;
}

export default function ManagePostsPage() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  // Helper function to get API URL based on environment
  const getPostsApiUrl = (): string => {
    if (typeof window !== 'undefined' && window.location.hostname.includes('pages.dev')) {
      return 'https://travel-blog-posts.andreas-e-ludviksen.workers.dev';
    }
    return process.env.NEXT_PUBLIC_POSTS_API_URL || 'http://localhost:8788';
  };

  // Helper function to get session token
  const getSessionToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    
    const storedToken = localStorage.getItem('session_token');
    if (storedToken) return storedToken;
    
    const cookies = document.cookie.split(';');
    const sessionCookie = cookies.find(c => c.trim().startsWith('session='));
    return sessionCookie ? sessionCookie.split('=')[1] : null;
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/posts/manage');
    }
  }, [isAuthenticated, authLoading, router]);

  // Check contributor role
  useEffect(() => {
    if (!authLoading && isAuthenticated && user?.role !== 'contributor') {
      router.push('/blog');
    }
  }, [user, isAuthenticated, authLoading, router]);

  // Load posts
  useEffect(() => {
    if (isAuthenticated && user?.role === 'contributor') {
      loadPosts();
    }
  }, [isAuthenticated, user]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getSessionToken();
      if (!token) {
        throw new Error('No session token found');
      }

      const apiUrl = getPostsApiUrl();
      const response = await fetch(`${apiUrl}/api/posts?status=all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status}`);
      }

      const data = await response.json();
      setPosts(data.posts || []);
    } catch (err) {
      console.error('Failed to load posts:', err);
      setError(err instanceof Error ? err.message : 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: string, postTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${postTitle}"? This will permanently delete all photos, videos, and text content.`)) {
      return;
    }

    try {
      setDeleteLoading(postId);
      setError(null);

      const token = getSessionToken();
      if (!token) {
        throw new Error('No session token found');
      }

      const apiUrl = getPostsApiUrl();
      const response = await fetch(`${apiUrl}/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));
        throw new Error(errorData.message || `Failed to delete post: ${response.status}`);
      }

      // Remove from list
      setPosts(posts.filter(p => p.id !== postId));
    } catch (err) {
      console.error('Failed to delete post:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete post');
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading posts...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'contributor') {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Blog Posts</h1>
              <p className="mt-2 text-gray-600">View and manage your blog posts</p>
            </div>
            <Link
              href="/posts/create"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create New Post
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{error}</span>
            <button
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setError(null)}
            >
              <span className="text-xl">&times;</span>
            </button>
          </div>
        )}

        {/* Posts List */}
        {posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">No blog posts yet</p>
            <Link
              href="/posts/create"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Create Your First Post
            </Link>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Content
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updated
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">{post.title}</div>
                        <div className="text-sm text-gray-500">{post.slug}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        post.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-3">
                        {post.photo_count !== undefined && (
                          <span title="Photos">📷 {post.photo_count}</span>
                        )}
                        {post.video_count !== undefined && (
                          <span title="Videos">🎥 {post.video_count}</span>
                        )}
                        {post.text_count !== undefined && (
                          <span title="Text blocks">📝 {post.text_count}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(post.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(post.updated_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex gap-2 justify-end">
                        {post.status === 'published' && (
                          <Link
                            href={`/blog?slug=${post.slug}`}
                            className="text-blue-600 hover:text-blue-900"
                            title="View post"
                          >
                            View
                          </Link>
                        )}
                        <Link
                          href={`/posts/create?id=${post.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit post"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id, post.title)}
                          disabled={deleteLoading === post.id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete post"
                        >
                          {deleteLoading === post.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
