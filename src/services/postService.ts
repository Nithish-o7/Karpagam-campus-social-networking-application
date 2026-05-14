/**
 * KCE Connect — Post Service (Phase 8)
 * Proxies all /api/posts requests through the axios base client.
 */
import apiClient from './apiClient';

/** Shape of a post from the SQLite backend */
export interface FeedPost {
  id: number;
  author_name: string;
  author_role: 'student' | 'faculty' | 'staff' | 'alumni';
  author_dept: string;
  content: string;
  timestamp: string;
  likes: number;
  comments_count: number;
  has_liked: boolean;
}

export const postService = {
  /** Fetch the social feed (newest first). */
  async getFeed(limit = 20, offset = 0): Promise<FeedPost[]> {
    const { data } = await apiClient.get<{ success: boolean; posts: FeedPost[] }>('/posts', {
      params: { limit, offset },
    });
    return data.posts ?? [];
  },

  /** Create a new campus post. */
  async create(content: string): Promise<FeedPost> {
    const { data } = await apiClient.post<{ success: boolean; post: FeedPost }>('/posts', { content });
    return data.post;
  },

  /** Toggle like status. */
  async like(id: number): Promise<{ success: boolean; has_liked: boolean }> {
    const { data } = await apiClient.post<{ success: boolean; has_liked: boolean }>(`/posts/${id}/like`);
    return data;
  },
};
