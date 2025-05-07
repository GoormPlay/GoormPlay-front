import { ApiConfig, ApiError, ApiResponse, ApiEndpoint, API_ENDPOINTS } from './types';

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

  public async get<T>(endpoint: ApiEndpoint): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.config.baseURL}${API_ENDPOINTS[endpoint]}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  public async post<T>(endpoint: ApiEndpoint, data: unknown): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.config.baseURL}${API_ENDPOINTS[endpoint]}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }
} 