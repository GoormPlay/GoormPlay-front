export interface ApiConfig {
  baseURL: string;
  serviceBaseURLs?: Record<string, string>;
  headers?: Record<string, string>;
}

export interface ApiError {
  message: string;
  status: number;
  data?: unknown;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
}

// 비디오 관련
export interface Video {
  id: string;
  kind: string;
  genre: string[];
  title: string;
  videoId: string;
  thumbnail: string;
  synopsis: string;
  trending?: boolean;
  latest?: boolean;
  personalized?: boolean;
}
// 비디오 관련
export interface VideoCard {
  id: string;
  kind: string;
  genre: string[];
  title: string;
  videoId: string;
  thumbnail: string;
  trending?: boolean;
  latest?: boolean;
  personalized?: boolean;
}

export type VideoEventType = 'play' | 'pause' | 'end' | 'exit' | 'time';

export interface VideoEvent {
  videoId: string;
  eventType: VideoEventType;
  timestamp: string;
  currentTime: number;
}

// 유저 관련
export interface User {
  id: string;
    username: string;
    password: string;
    subscription: string;
    liked: Video[];
}

export interface UserProfile {
  username: string;
  subscription: string;
  liked: VideoCard[];
}


// 광고 관련
export interface Ad {
  id: string;
    adSnId: string;
    type: 'A' | 'B'
    title: string;
    thumbnailUrl: string;
    link: string;
    impressions: number;
    clicks: number;
    cpc: number;
    balance: number;
}

export const API_ENDPOINTS = {
  VIDEOS: {
    path: '/api/contents/latest',
    service: 'content' as const,
  },
  TRENDING: {
    path: '/api/contents/trending',
    service: 'content' as const,
  },
  LATEST: {
    path: '/api/contents/latest-test',
    service: 'content' as const,
  },
  RECOMMEND: {
    path: '/api/contents/recommend',
    service: 'content' as const,
  },
  VIDEO_DETAIL: {
    path: '/api/contents', // /:id
    service: 'content' as const,
  },
  TRACK_EVENT: {
    path: '/api/events/video',
    service: 'videoEvent' as const,
  },
  LOGIN: {
    path: '/api/auth/login',
    service: 'user' as const,
  },
  SIGNUP: {
    path: '/api/auth/signup',
    service: 'user' as const,
  },
  PROFILE: {
    path:'/api/member/profile',
    service: 'user' as const,
  },
  HISTORY: {
    path: '/api/member/history',
    service: 'user' as const,
  },
  LIKES: {
    path: '/api/member/likes',
    service: 'user' as const,
  },
  SUBSCRIPTION: {
    path: '/api/subscription',
    service: 'subscription' as const,
  },
  ADS: {
    path: '/api/ads',
    service: 'ad' as const,
  },
} as const;

export type ApiEndpoint = keyof typeof API_ENDPOINTS;
export type ServiceName = typeof API_ENDPOINTS[ApiEndpoint]['service'];