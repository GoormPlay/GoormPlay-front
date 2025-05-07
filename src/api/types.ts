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
  VIDEOS: '/api/videos',
  TRACK_EVENT: '/api/track-event',
} as const;

export type ApiEndpoint = keyof typeof API_ENDPOINTS; 