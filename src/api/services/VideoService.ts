import { ApiClient } from '../ApiClient';
import { VideoEvent } from '../../types/video';
import { Video, ContentDetailResponse, PaginatedResponse } from '../types';
import { VideoPreview } from '../../types/video';

// dummyVideos를 VideoPreview 타입으로 선언
const dummyVideos: VideoPreview[] = [
  {
    title: "기생충",
    genre: ["드라마", "스릴러"],
    videoId: "5xH0HfJHsaY"
  },
  {
    title: "올드보이",
    genre: ["액션", "드라마", "미스터리"],
    videoId: "2HkjrJ6IK5E"
  },
  {
    title: "라라랜드",
    genre: ["뮤지컬", "로맨스"],
    videoId: "0pdqf4P9MB8"
  },
  {
    title: "인터스텔라",
    genre: ["SF", "드라마"],
    videoId: "zSWdZVtXT7E"
  },
  {
    title: "어벤져스: 엔드게임",
    genre: ["액션", "SF"],
    videoId: "TcMBFSGVi1c"
  },
  {
    title: "조커",
    genre: ["드라마", "스릴러"],
    videoId: "zAGVQLHvwOY"
  },
  {
    title: "기묘한 이야기",
    genre: ["SF", "스릴러"],
    videoId: "b9EkMc79ZSU"
  },
  {
    title: "더 배트맨",
    genre: ["액션", "범죄"],
    videoId: "mqqft2x_Aa4"
  },
  {
    title: "듄",
    genre: ["SF", "드라마"],
    videoId: "n9xhJrPXop4"
  },
  {
    title: "소울",
    genre: ["애니메이션", "드라마"],
    videoId: "xOsLIiBStEs"
  },
  {
    title: "원더 우먼 1984",
    genre: ["액션", "판타지"],
    videoId: "sfM7_JLk-84"
  },
  {
    title: "테넷",
    genre: ["액션", "SF"],
    videoId: "L3pk_TBkihU"
  },
  {
    title: "노매드랜드",
    genre: ["드라마"],
    videoId: "6sxCFZ8_d84"
  },
  {
    title: "더 수어사이드 스쿼드",
    genre: ["액션", "코미디"],
    videoId: "Z1EbSXxrZ34"
  },
  {
    title: "인사이드 아웃",
    genre: ["애니메이션", "가족"],
    videoId: "seMwpP0yeu4"
  },
  {
    title: "라야와 마지막 드래곤",
    genre: ["애니메이션", "판타지"],
    videoId: "1VIZ89FEjYI"
  },
  {
    title: "루카",
    genre: ["애니메이션", "가족"],
    videoId: "mYfJxlgR2jw"
  },
  {
    title: "크루엘라",
    genre: ["범죄", "드라마"],
    videoId: "gmRKv7n2If8"
  },
  {
    title: "샹치와 텐 링즈의 전설",
    genre: ["액션", "판타지"],
    videoId: "8YjFbMbfXaQ"
  },
  {
    title: "이터널스",
    genre: ["액션", "SF"],
    videoId: "x_me3xsvDgk"
  },
  {
    title: "킹스맨: 퍼스트 에이전트",
    genre: ["액션", "스릴러"],
    videoId: "0pbLPOrTSsI"
  },
  {
    title: "스파이더맨: 노 웨이 홈",
    genre: ["액션", "SF"],
    videoId: "JfVOs4VSpmA"
  },
  {
    title: "더 프렌치 디스패치",
    genre: ["코미디", "드라마"],
    videoId: "TcPk2p0Zaw4"
  },
  {
    title: "하우스 오브 구찌",
    genre: ["드라마", "범죄"],
    videoId: "eGNnpVKxV6s"
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

  async getLatest(page: number = 0, size: number = 10): Promise<PaginatedResponse<VideoPreview>> {
    try {
      const response = await this.apiClient.get<PaginatedResponse<Video>>('LATEST', { page: page.toString(), size: size.toString() });
      const previews: VideoPreview[] = response.data.contents.map(video => ({
        title: video.title,
        genre: video.genre,
        videoId: video.videoId
      }));
      return {
        ...response.data,
        contents: previews
      };
    } catch (error) {
      console.error('Error fetching videos:', error);
      const previews: VideoPreview[] = dummyVideos.map(video => ({
        title: video.title,
        genre: video.genre,
        videoId: video.videoId
      }));
      return {
        contents: previews,
        page: 0,
        size: 10,
        totalElements: previews.length,
        totalPages: Math.ceil(previews.length / 10),
        isLast: true
      };
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

  async getContentDetail(videoId: string): Promise<ContentDetailResponse> {
    try {
      const response = await this.apiClient.get<ContentDetailResponse>('VIDEO_DETAIL', 
        null,  // data는 null
        { params: { videoId } }  // query parameter로 전달

      );
      return response.data;
    } catch (error) {
      console.error('Error fetching content detail:', error);
      throw error;
    }
  }
}

export const videoService = new VideoService(ApiClient.getInstance());