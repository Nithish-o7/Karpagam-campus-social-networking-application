/**
 * KCE Connect — Campus Service (Phase 12: Real-time Widgets)
 */
import apiClient from './apiClient';

export interface CampusEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  venue: string;
  category: string;
}

export interface TrendingTopic {
  tag: string;
  posts: number;
}

export const campusService = {
  async getEvents(): Promise<CampusEvent[]> {
    const { data } = await apiClient.get('/campus/events');
    return data.events;
  },

  async getTrending(): Promise<TrendingTopic[]> {
    const { data } = await apiClient.get('/campus/trending');
    return data.topics;
  }
};
