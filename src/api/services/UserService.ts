import { ApiClient } from "../ApiClient";
import { User } from "../../types/User";

class UserService {
    private apiClient: ApiClient;

    constructor(apiClient: ApiClient) {
        this.apiClient = apiClient;
    }

    async login(username: string, password: string) {
        return this.apiClient.post<{ token: string }>('LOGIN', { username, password });
      }
      async signup(username: string, password: string) {
        return this.apiClient.post('SIGNUP', { username, password });
      }
      async getProfile() {
        return this.apiClient.get<User>('PROFILE');
      }
      async getHistory() {
        return this.apiClient.get('HISTORY');
      }
      async getLikes() {
        return this.apiClient.get('LIKES');
      }
}

export const userService = new UserService(ApiClient.getInstance());