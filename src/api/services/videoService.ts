import { ApiClient } from '../ApiClient';
import { Video, VideoEvent } from '../../types/video';
import { API_ENDPOINTS } from '../types';

// dummyVideos를 Video 타입으로 선언
const dummyVideos: Video[] = [
  {
    id: "681c4f881c23f65a639fde17",
    title: "기생충",
    kind: "MOVIE",
    genre: ["드라마", "스릴러"],
    thumbnail: "",
    videoId: "5xH0HfJHsaY",
    synopsis: "가난한 가족이 부잣집에 얽히며 벌어지는 블랙코미디 스릴러."
  },
  {
    id: "681c4f881c23f65a639fde18",
    title: "올드보이",
    kind: "MOVIE",
    genre: ["액션", "드라마", "미스터리"],
    thumbnail: "",
    videoId: "2HkjrJ6IK5E",
    synopsis: "15년간 감금된 남자의 복수극을 그린 미스터리 액션."
  },
  {
    id: "681c4f881c23f65a639fde19",
    title: "라라랜드",
    kind: "MOVIE",
    genre: ["뮤지컬", "로맨스"],
    thumbnail: "",
    videoId: "0pdqf4P9MB8",
    synopsis: "꿈을 좇는 두 남녀의 사랑과 이별을 그린 뮤지컬 영화."
  },
  {
    id: "681c4f881c23f65a639fde20",
    title: "인터스텔라",
    kind: "MOVIE",
    genre: ["SF", "드라마"],
    thumbnail: "",
    videoId: "zSWdZVtXT7E",
    synopsis: "인류의 미래를 위해 우주로 떠나는 아버지와 딸의 이야기."
  }
];

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
      return dummyVideos;
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