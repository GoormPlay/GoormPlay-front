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

  async trackEvent(event: VideoEvent): Promise<void> {
    try {
      await this.apiClient.post('TRACK_EVENT', event);
    } catch (error) {
      console.error('Error tracking event:', error);
      throw error;
    }
  }
}

export const videoService = new VideoService(
  ApiClient.getInstance({
    baseURL: 'http://localhost:8080',
  })
); 