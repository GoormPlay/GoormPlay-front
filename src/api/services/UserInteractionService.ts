import { ApiClient } from "../ApiClient";
import { InteractionRequestDto, ContentClickEventDto } from "../types";

class UserInteractionService {
    private apiClient: ApiClient;

    constructor(apiClient: ApiClient) {
        this.apiClient = apiClient;
    }

    async updateLike(videoId: string) {
        const requestDto: InteractionRequestDto = {
            contentId: videoId
        };
        return this.apiClient.post<void>('LIKE', requestDto);
    }

    async trackContentClick(
        videoId: string, 
        isTrending: boolean, 
        isLatest: boolean, 
        isRecommended: boolean,
        genre: string[]
    ) {
        const requestDto: ContentClickEventDto = {
            contentId: videoId,
            timestamp: new Date().toISOString(),
            trending: isTrending,
            latest: isLatest,
            recommended: isRecommended,
            genre: genre
        };
        return this.apiClient.post<void>('CONTENT_CLICK', requestDto);
    }
}

export const userInteractionService = new UserInteractionService(ApiClient.getInstance());
