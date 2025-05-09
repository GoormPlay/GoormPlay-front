export interface ApiConfig {
  baseURL: string;
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

export const API_ENDPOINTS = {
  VIDEOS: '/api/contents/latest-test',
  TRACK_EVENT: '/api/events/video',
} as const;

export type ApiEndpoint = keyof typeof API_ENDPOINTS; 