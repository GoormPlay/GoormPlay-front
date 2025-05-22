import { ApiClient } from "../ApiClient";
import { InteractionRequestDto } from "../types";

class UserInteractionService {
    private apiClient: ApiClient;

    constructor(apiClient: ApiClient) {
        this.apiClient = apiClient;
    }

    async updateLike(videoId: string, liked: boolean) {
        const requestDto: InteractionRequestDto = {
            contentId: videoId,
            liked
        };
        return this.apiClient.post<void>('LIKE', requestDto);
    }
}

export const userInteractionService = new UserInteractionService(ApiClient.getInstance());
