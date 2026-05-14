/**
 * KCE Connect — Post Service (Phase 14: Polls)
 */
import apiClient from './apiClient';

export interface PollOption {
  id: number;
  text: string;
  votes: number;
}

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
  poll_options?: PollOption[];
  user_poll_vote?: number | null;
}

export interface Comment {
  id: number;
  content: string;
  author_name: string;
  author_role: string;
  createdAt: string;
}

export const postService = {
  async getFeed(limit = 20, offset = 0): Promise<FeedPost[]> {
    const { data } = await apiClient.get<{ success: boolean; posts: FeedPost[] }>('/posts', {
      params: { limit, offset },
    });
    return data.posts ?? [];
  },

  async create(content: string, pollOptions?: string[]): Promise<FeedPost> {
    const { data } = await apiClient.post<{ success: boolean; post: FeedPost }>('/posts', {
      content,
      ...(pollOptions && pollOptions.length >= 2 ? { pollOptions } : {})
    });
    return data.post;
  },

  async like(id: number): Promise<{ success: boolean; has_liked: boolean }> {
    const { data } = await apiClient.post<{ success: boolean; has_liked: boolean }>(`/posts/${id}/like`);
    return data;
  },

  async getComments(id: number): Promise<Comment[]> {
    const { data } = await apiClient.get<{ success: boolean; comments: Comment[] }>(`/posts/${id}/comments`);
    return data.comments ?? [];
  },

  async addComment(id: number, content: string): Promise<Comment> {
    const { data } = await apiClient.post<{ success: boolean; comment: Comment }>(`/posts/${id}/comment`, { content });
    return data.comment;
  },

  async votePoll(postId: number, optionId: number): Promise<void> {
    await apiClient.post(`/posts/${postId}/poll-vote`, { optionId });
  },
};

