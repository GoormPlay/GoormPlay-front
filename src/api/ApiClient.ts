import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { 
  ApiError,
  ApiResponse,
  ApiEndpoint,
  API_ENDPOINTS,
  CustomRequestConfig,
  CustomInternalRequestConfig
} from './types';

// API Gateway URL을 기본 URL로 설정
const GATEWAY_URL = process.env.REACT_APP_API_GATEWAY_URL || 'http://localhost:8080';

export class ApiClient {
  private static instance: ApiClient;
  private axiosInstance: AxiosInstance;
  private authToken: string | null = null;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: GATEWAY_URL,
      withCredentials: false,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    

    // 요청 인터셉터
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const customConfig = config as CustomInternalRequestConfig;
        const endpointKey = customConfig.endpointKey;
        console.log('Request Config:', config);  // 전체 설정 로그
        console.log('Endpoint Key:', endpointKey);  // endpoint key 확인
        
        if (endpointKey) {
          const endpoint = API_ENDPOINTS[endpointKey];
          console.log('Endpoint Config:', endpoint);  // endpoint 설정 확인
          const basePath = endpoint.isPublic ? '/api/public' : '/api';
          
          // URL에서 path parameter 처리
          let url = `${basePath}${endpoint.path}`;
          if (customConfig.params) {
            Object.entries(customConfig.params).forEach(([key, value]) => {
              if (url.includes(`{${key}}`)) {
                url = url.replace(`{${key}}`, value as string);
                delete customConfig.params[key];
              }
            });
          }
          
          customConfig.url = url;
          console.log('Final Request URL:', customConfig.url);  // 실제 요청 URL 확인
          
          if (!endpoint.isPublic && !endpoint.isAuth) {
            const token = localStorage.getItem('accessToken');
            if (token) {
              customConfig.headers.Authorization = `Bearer ${token}`;
            }
          }
        }
        return customConfig;
      },
      (error) => Promise.reject(error)
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

        // 401 에러일 때만 토큰 제거
        if (error.response?.status === 401) {
          localStorage.removeItem('accessToken');
          this.setAuthToken(null);
        }

        return Promise.reject(apiError);
      }
    );
  }

    public async request<T>(
    endpointKey: ApiEndpoint,
    config: Omit<CustomRequestConfig, 'url'> = {}
  ): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance({
      ...config,
      endpointKey,
    } as CustomRequestConfig);

    return {
      data: response.data,
      status: response.status
    };
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
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  public async post<T>(endpoint: ApiEndpoint, data: unknown, config?: { params?: Record<string, string> }): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'POST', data, params: config?.params });
  }

  public async put<T>(endpoint: ApiEndpoint, data: unknown, config?: { params?: Record<string, string> }): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PUT', data, params: config?.params });
  }

  public async patch<T>(endpoint: ApiEndpoint, data: unknown, config?: { params?: Record<string, string> }): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PATCH', data, params: config?.params });
  }

  public async delete<T>(endpoint: ApiEndpoint, config?: { params?: Record<string, string> }): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE', params: config?.params });
  }

  public async postMultipart<T>(endpoint: ApiEndpoint, formData: FormData): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

} 