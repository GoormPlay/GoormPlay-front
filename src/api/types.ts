import { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
export interface ApiConfig {
  baseURL: string;
  serviceBaseURLs?: Record<string, string>;
  headers?: Record<string, string>;
}

export interface EndpointConfig {
  path: string;
  isPublic?: boolean;
}

// AxiosRequestConfig 확장
export interface CustomRequestConfig extends AxiosRequestConfig {
  endpointKey?: keyof typeof API_ENDPOINTS;
}
export interface CustomInternalRequestConfig extends InternalAxiosRequestConfig {
  endpointKey?: keyof typeof API_ENDPOINTS;
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

// 광고 예산 관련
export interface RechargeRequestDTO {
  advertiserId: string;
  amount: number;
}

export interface AdvertiserAccountDTO {
  advertiserId: string;
  totalBudget: number;
  currentBalance: number;
  createdAt: string;
}

// 인증 관련
export interface SignUpRequestDto {
  username: string;
  password: string;
  gender: 'MALE' | 'FEMALE';
  age: number;
}

export interface SignInRequestDto {
  username: string;
  password: string;
}

export interface MemberProfileDto {
  id: string;
  username: string;
  gender: 'MALE' | 'FEMALE';
  age: number;
  subscription_start_date?: string;
  subscription_end_date?: string;
  isCancelScheduled?: boolean;
  isSubscribed?: boolean;
  liked?: Video[];
}

export const API_ENDPOINTS = {
  VIDEOS: {
    path: '/contents/latest',
    isPublic: true,
    isAuth: false,
    service: 'content' as const,
  },
  TRENDING: {
    path: '/contents/trending',
    isPublic: true,
    isAuth: false,
    service: 'content' as const,
  },
  LATEST: {
    path: '/contents/latest-test',
    isPublic: true,
    isAuth: false,
    service: 'content' as const,
  },
  RECOMMEND: {
    path: '/contents/recommend',
    isPublic: false,
    isAuth: false,
    service: 'content' as const,
  },
  VIDEO_DETAIL: {
    path: '/contents', // /:id
    isPublic: true,
    isAuth: false,
    service: 'content' as const,
  },
  TRACK_EVENT: {
    path: '/events/video',
    isPublic: true,
    isAuth: false,
    service: 'videoEvent' as const,
  },

  HISTORY: {
    path: '/member/history',
    isPublic: false,
    isAuth: false,
    service: 'user' as const,
  },
  LIKES: {
    path: '/member/likes',
    isPublic: false,
    isAuth: false,
    service: 'user' as const,
  },
  SUBSCRIPTION: {
    path: '/subscribe',
    isPublic: false,
    isAuth: false,
    service: 'subscription' as const,
  },
  ADS: {
    path: '/ads/list',
    isPublic: true,
    isAuth: false,
    service: 'ad' as const,
  },
  CREATE_AD: {
    path: '/ads/new',
    isPublic: true,
    isAuth: false,
    service: 'ad' as const,
  },
  AD_RECHARGE: {
    path: '/ads/recharge',
    isPublic: true,
    isAuth: false,
    service: 'ad' as const,
  },
  AD_BALANCE: {
    path: '/ads/balance',
    isPublic: true,
    isAuth: false,
    service: 'ad' as const,
  },
  SIGNIN: {
    path: '/auth/signin',
    isPublic: false,
    isAuth: true,
    service: 'auth' as const,
  },
  SIGNUP: {
    path: '/auth/signup',
    isPublic: false,
    isAuth: true,
    service: 'auth' as const,
  },
  PROFILE: {
    path: '/member/profile',
    isPublic: false,
    isAuth: false,
    service: 'member' as const,
  },
} as const;

export type ApiEndpoint = keyof typeof API_ENDPOINTS;
export type ServiceName = typeof API_ENDPOINTS[ApiEndpoint]['service'];