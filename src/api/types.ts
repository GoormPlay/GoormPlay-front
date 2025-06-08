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
  videoId: string;
  title: string;
  kind: string;
  genre: string[];
  thumbnail: string;
  synopsis: string;
  trending?: boolean;
  latest?: boolean;
  recommended?: boolean;
  year?: number;
  KMRB?: string;
  cast?: string[];
  provider?: string[];
  director?: string[];
  releaseDate?: string;
}

export interface CreateReviewRequest {
  comment: string;
  rating: number;
}

export interface UpdateReviewRequest {
  id: string;
  comment: string;
  rating: number;
}

export interface Review {
  id?: string;
  userId: string;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ContentDetailResponse {
  content: Video;
  isLiked: boolean;
  reviews: Review[];
  averageRating: number;
}

// 비디오 관련
export interface VideoCard {
  videoId: string;
  kind: string;
  genre: string[];
  title: string;
  thumbnail: string;
  trending?: boolean;
  latest?: boolean;
  recommended?: boolean;
}

export interface ContentCard {
  videoId: string;
  title: string;
  kind: string;
  genre: string[];
  thumbnail: string;
}

export type VideoEventType = 'play_start' | 'play_pause' | 'play_exit' | 'play_end';

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

export interface SignInResponseDto {
  accessToken: string;
  username: string;
}

export interface MemberProfileDto {
  username: string;
  gender: 'MALE' | 'FEMALE';
  age: number;
  subscription_start_date?: string;
  subscription_end_date?: string;
  isCancelScheduled?: boolean;
  isSubscribed?: boolean;
  liked?: Video[];
}

export interface InteractionRequestDto {
  videoId: string;
  timestamp: string;
}

export interface ContentClickEventDto {
  videoId: string;
  timestamp: string;
  trending: boolean;
  latest: boolean;
  recommended: boolean;
  genre: string[];
}

export interface PaginatedResponse<T> {
  contents: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  isLast: boolean;
}

export interface VideoEventDto {
  videoId: string;
  timestamp: string;
  eventType: VideoEventType;
  watchProgress: number;
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
    path: '/contents/latest',
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
    path: '/contents/{id}',
    isPublic: true,
    isAuth: false,
    service: 'content' as const,
  },
  TRACK_EVENT: {
    path: '/ui/play/{videoId}',
    isPublic: false,
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
  LIKE: {
    path: '/ui/like',
    isPublic: false,
    isAuth: false,
    service: 'interaction' as const,
  },
  CONTENT_CLICK: {
    path: '/ui/click/content',
    isPublic: false,
    isAuth: false,
    service: 'interaction' as const,
  },
  CREATE_REVIEW: {
    path: '/review/new',
    isPublic: false,
    isAuth: false,
    service: 'review' as const,
  },
  UPDATE_REVIEW: {
    path: '/review/update',
    isPublic: false,
    isAuth: false,
    service: 'review' as const,
  },
  DELETE_REVIEW: {
    path: '/review/delete/{reviewId}',
    isPublic: false,
    isAuth: false,
    service: 'review' as const,
  },
  GET_REVIEWS: {
    path: '/review/list',
    isPublic: false,
    isAuth: false,
    service: 'review' as const,
  },
} as const;

export type ApiEndpoint = keyof typeof API_ENDPOINTS;
export type ServiceName = typeof API_ENDPOINTS[ApiEndpoint]['service'];