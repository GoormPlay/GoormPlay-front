import { ApiClient } from "../ApiClient";
import { User, SignUpRequestDto, SignInRequestDto, MemberProfileDto } from "../types";

class UserService {
    private apiClient: ApiClient;

    constructor(apiClient: ApiClient) {
        this.apiClient = apiClient;
    }

    async signIn(data: SignInRequestDto) {
      const response = await this.apiClient.post<{ message: string; data: string }>('SIGNIN', data);
      if (response.data.data) {
          localStorage.setItem('accessToken', response.data.data);
          this.apiClient.setAuthToken(response.data.data);
      }
        return response;
    }

    async signUp(data: SignUpRequestDto) {
        return this.apiClient.post<string>('SIGNUP', data);
    }

    async getProfile() {
        return this.apiClient.get<MemberProfileDto>('PROFILE');
    }

    async getHistory() {
        return this.apiClient.get('HISTORY');
    }

    async getLikes() {
        return this.apiClient.get('LIKES');
    }

    logout() {
        localStorage.removeItem('accessToken');
        this.apiClient.setAuthToken(null);
    }
}

export const userService = new UserService(ApiClient.getInstance());