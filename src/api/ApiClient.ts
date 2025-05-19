import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiError, ApiResponse, ApiEndpoint, API_ENDPOINTS } from './types';

// API Gateway URL을 기본 URL로 설정
const GATEWAY_URL = process.env.REACT_APP_API_GATEWAY_URL || 'http://localhost:8080';

export class ApiClient {
  private static instance: ApiClient;
  private axiosInstance: AxiosInstance;
  private authToken: string | null = null;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: GATEWAY_URL,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // 요청 인터셉터
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }
        return config;
      },
      (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
      }
    );

    // 응답 인터셉터
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('Response Error:', error);
        const apiError: ApiError = {
          message: error.response?.data?.message || error.response?.statusText || '알 수 없는 오류가 발생했습니다.',
          status: error.response?.status || 500,
          data: error.response?.data,
        };
        return Promise.reject(apiError);
      }
    );
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  public setAuthToken(token: string | null): void {
    this.authToken = token;
  }

  private handleResponse<T>(response: AxiosResponse): ApiResponse<T> {
    return {
      data: response.data,
      status: response.status,
    };
  }

  public async get<T>(endpoint: ApiEndpoint, params?: Record<string, string>): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.get<T>(
      API_ENDPOINTS[endpoint].path,
      { params }
    );
    return this.handleResponse<T>(response);
  }

  public async post<T>(endpoint: ApiEndpoint, data: unknown): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.post<T>(
      API_ENDPOINTS[endpoint].path,
      data
    );
    return this.handleResponse<T>(response);
  }

  public async postMultipart<T>(endpoint: ApiEndpoint, formData: FormData): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.post<T>(
      API_ENDPOINTS[endpoint].path,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return this.handleResponse<T>(response);
  }
} 