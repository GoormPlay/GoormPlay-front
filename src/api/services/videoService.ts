import { ApiClient } from '../ApiClient';
import { Video, VideoEvent } from '../../types/video';
import { API_ENDPOINTS } from '../types';

class VideoService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async getVideos(): Promise<Video[]> {
    try {
      const response = await this.apiClient.get<Video[]>('VIDEOS');
      return response.data;
    } catch (error) {
      console.error('Error fetching videos:', error);
      throw error;
    }
  }

  async getLatest(): Promise<Video[]> {
    try {
      const response = await this.apiClient.get<Video[]>('LATEST');
      return response.data;
    } catch (error) {
      console.error('Error fetching videos:', error);
      throw error;
    }
  }

  async getTrending(): Promise<Video[]> {
    try {
      const response = await this.apiClient.get<Video[]>('TRENDING');
      return response.data;
    } catch (error) {
      console.error('Error fetching videos:', error);
      throw error;
    }
  }

  async getRecommend(): Promise<Video[]> {
    try {
      const response = await this.apiClient.get<Video[]>('RECOMMEND');
      return response.data;
    } catch (error) {
      console.error('Error fetching videos:', error);
      throw error;
    }
  }

  async trackEvent(event: VideoEvent): Promise<void> {
    try {
      await this.apiClient.post('TRACK_EVENT', event);
    } catch (error) {
      console.error('Error tracking event:', error);
      throw error;
    }
  }
}

const apiClient = ApiClient.getInstance({
  baseURL: process.env.REACT_APP_API_URL || '',
  serviceBaseURLs: {
    content: process.env.REACT_APP_CONTENT_API_URL || '',
    videoEvent: process.env.REACT_APP_VIDEO_EVENT_API_URL || '',
  },
});

export const videoService = new VideoService(apiClient);