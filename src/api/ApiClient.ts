import { ApiConfig, ApiError, ApiResponse, ApiEndpoint, API_ENDPOINTS } from './types';

const SERVICE_BASE_URLS: Record<string, string> = {
  content: process.env.REACT_APP_CONTENT_API_URL || '',
  videoEvent: process.env.REACT_APP_VIDEO_EVENT_API_URL || '',
  user: process.env.REACT_APP_USER_API_URL || '',
  // ...필요시 추가
};

export class ApiClient {
  private static instance: ApiClient;
  private config: ApiConfig;
  private authToken: string | null = null;

  private constructor(config: ApiConfig) {
    this.config = config;
  }

  public static getInstance(config: ApiConfig): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient(config);
    }
    return ApiClient.instance;
  }

  public setAuthToken(token: string | null): void {
    this.authToken = token;
  }

  private getBaseURL(endpoint: ApiEndpoint): string {
    const service = API_ENDPOINTS[endpoint].service;
    // 1. config의 serviceBaseURLs에서 찾기
    if (this.config.serviceBaseURLs?.[service]) {
      return this.config.serviceBaseURLs[service];
    }
    // 2. 글로벌 SERVICE_BASE_URLS에서 찾기
    if (SERVICE_BASE_URLS[service]) {
      return SERVICE_BASE_URLS[service];
    }
    // 3. 기본 baseURL 사용
    return this.config.baseURL;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...this.config.headers,
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      const error: ApiError = {
        message: response.statusText,
        status: response.status,
      };

      try {
        error.data = await response.json();
      } catch {
        // JSON 파싱 실패 시 무시
      }

      throw error;
    }

    const data = await response.json();
    return {
      data,
      status: response.status,
    };
  }

  public async get<T>(endpoint: ApiEndpoint, pathParam?: string): Promise<ApiResponse<T>> {
    const baseURL = this.getBaseURL(endpoint);
    const url = pathParam
      ? `${baseURL}${API_ENDPOINTS[endpoint].path}/${pathParam}`
      : `${baseURL}${API_ENDPOINTS[endpoint].path}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include',
    });
    return this.handleResponse<T>(response);
  }

  public async post<T>(endpoint: ApiEndpoint, data: unknown): Promise<ApiResponse<T>> {
    const baseURL = this.getBaseURL(endpoint);
    const url = `${baseURL}${API_ENDPOINTS[endpoint].path}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
      credentials: 'include',
    });
    return this.handleResponse<T>(response);
  }
} 