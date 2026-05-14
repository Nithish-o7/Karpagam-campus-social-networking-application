import apiClient from './apiClient';
import type { User } from '../types';

/**
 * Auth Service — Hybrid Architecture
 * 
 * Interacts with the backend to perform:
 * 1. Standard Email/Password Login
 * 2. New User Registration
 * 3. Firebase Google SSO Sync
 */

interface AuthResponse {
  success: boolean;
  token:   string;
  user:    User;
  message?: string;
}

export const authService = {
  /**
   * Performs standard bcrypt-based login.
   */
  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return data;
  },

  /**
   * Registers a new user with institutional email and roll number.
   */
  async register(details: any): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/auth/register', details);
    return data;
  },

  /**
   * Syncs a Firebase Google user with our local Postgres database.
   * Returns a custom KCE JWT for the session.
   */
  async syncUser(idToken: string): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/auth/sync', {}, {
      headers: { Authorization: `Bearer ${idToken}` }
    });
    return data;
  },

  async updateProfile(details: { bio?: string; avatarUrl?: string; bannerUrl?: string }): Promise<AuthResponse> {
    const { data } = await apiClient.patch<AuthResponse>('/auth/profile', details);
    return data;
  },

  async getProfile(userId: number): Promise<{ success: boolean; user: User }> {
    const { data } = await apiClient.get<{ success: boolean; user: User }>(`/auth/profile/${userId}`);
    return data;
  },

  async getPeople(): Promise<any[]> {
    const { data } = await apiClient.get('/auth/people');
    return data.people ?? [];
  },

  async followUser(userId: number): Promise<void> {
    await apiClient.post(`/auth/follow/${userId}`);
  },

  async unfollowUser(userId: number): Promise<void> {
    await apiClient.delete(`/auth/follow/${userId}`);
  },
};
