import { ApiClient } from '../ApiClient';
import { SignUpRequestDto, SignInRequestDto, MemberProfileDto, ApiResponse, SignInResponseDto } from "../types";

class UserService {
    private apiClient: ApiClient;

    constructor(apiClient: ApiClient) {
        this.apiClient = apiClient;
    }

    async signIn(data: SignInRequestDto) {
      const response = await this.apiClient.post<{ message: string; data: SignInResponseDto }>('SIGNIN', data);
      if (response.data.data) {
          localStorage.setItem('accessToken', response.data.data.accessToken);
          localStorage.setItem('username', response.data.data.username);
          this.apiClient.setAuthToken(response.data.data.accessToken);
      }
        return response;
    }

    async signUp(data: SignUpRequestDto) {
        return this.apiClient.post<string>('SIGNUP', data);
    }

    async getProfile(): Promise<ApiResponse<{ data: MemberProfileDto }>> {
        return this.apiClient.get<{ data: MemberProfileDto }>('PROFILE');
    }

    async getHistory() {
        return this.apiClient.get('HISTORY');
    }

    async getLikes() {
        return this.apiClient.get('LIKES');
    }

    logout() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('username');
        this.apiClient.setAuthToken(null);
    }
}

export const userService = new UserService(ApiClient.getInstance());