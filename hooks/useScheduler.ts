import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { loadDemoPosts, persistDemoPosts, seedDemoPosts } from '@/lib/demo';
import { mapPostInsert } from '@/lib/posts';
import { AnalyticsSummary, Post } from '@/types';

export function useScheduler() {
  const { authMode } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadPosts = async () => {
      setLoading(true);

      if (authMode === 'demo') {
        seedDemoPosts();
        if (!cancelled) {
          setPosts(loadDemoPosts());
          setLoading(false);
        }
        return;
      }

      if (authMode === 'guest') {
        if (!cancelled) {
          setPosts([]);
          setLoading(false);
        }
        return;
      }

      try {
        const response = await fetch('/api/posts', {
          cache: 'no-store',
        });
        const body = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(body?.error || 'Unable to load posts.');
        }

        if (!cancelled) {
          setPosts(body.posts as Post[]);
        }
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          setPosts([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadPosts();

    return () => {
      cancelled = true;
    };
  }, [authMode]);

  const saveDemoPosts = (updatedPosts: Post[]) => {
    setPosts(updatedPosts);
    persistDemoPosts(updatedPosts);
  };

  const addPost = async (postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (authMode === 'demo') {
      const newPost: Post = {
        ...postData,
        id: `post-${Math.random().toString(36).slice(2, 11)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updated = [...posts, newPost];
      saveDemoPosts(updated);
      return newPost;
    }

    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mapPostInsert(postData)),
    });
    const body = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(body?.error || 'Unable to create post.');
    }

    const newPost = body.post as Post;
    setPosts((currentPosts) => [...currentPosts, newPost]);
    return newPost;
  };

  const updatePost = async (id: string, updates: Partial<Post>) => {
    if (authMode === 'demo') {
      const updated = posts.map((post) => {
        if (post.id === id) {
          return {
            ...post,
            ...updates,
            updatedAt: new Date().toISOString(),
          };
        }

        return post;
      });

      saveDemoPosts(updated);
      return;
    }

    const response = await fetch(`/api/posts/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    const body = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(body?.error || 'Unable to update post.');
    }

    setPosts((currentPosts) =>
      currentPosts.map((post) => (post.id === id ? (body.post as Post) : post)),
    );
  };

  const deletePost = async (id: string) => {
    if (authMode === 'demo') {
      const updated = posts.filter((post) => post.id !== id);
      saveDemoPosts(updated);
      return;
    }

    const response = await fetch(`/api/posts/${id}`, {
      method: 'DELETE',
    });
    const body = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(body?.error || 'Unable to delete post.');
    }

    setPosts((currentPosts) => currentPosts.filter((post) => post.id !== id));
  };

  const getAnalytics = (): AnalyticsSummary => {
    const published = posts.filter((post) => post.status === 'published').length;
    const scheduled = posts.filter((post) => post.status === 'scheduled').length;

    const totalImpressions = published * 14205 + scheduled * 450 + 24820;
    const baseEngagementRate = 4.8;
    const engagementRate =
      published > 0
        ? Math.min(8.9, Math.max(2.1, baseEngagementRate + published * 0.4 - scheduled * 0.1))
        : 0;

    return {
      totalImpressions,
      engagementRate: parseFloat(engagementRate.toFixed(1)),
      scheduledCount: scheduled,
      publishedCount: published,
      weeklyGrowth: published > 0 ? 12.4 + published * 1.5 : 8.2,
    };
  };

  return { posts, loading, addPost, updatePost, deletePost, getAnalytics };
}
