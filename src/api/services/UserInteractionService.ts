import { ApiClient } from "../ApiClient";
import { InteractionRequestDto, ContentClickEventDto, VideoEventType, VideoEventDto } from "../types";

class UserInteractionService {
    private apiClient: ApiClient;

    constructor(apiClient: ApiClient) {
        this.apiClient = apiClient;
    }

    async updateLike(videoId: string) {
        const requestDto: InteractionRequestDto = {
            contentId: videoId,
            timestamp: new Date().toISOString()
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

    async trackEvent(contentId: string, eventType: VideoEventType, timestamp: string, watchProgress: number) {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        try {
            const requestDto: VideoEventDto = {
                contentId,
                timestamp,
                eventType,
                watchProgress
            };
            await this.apiClient.post<void>('TRACK_EVENT', requestDto, { params: { contentId } });
        } catch (error) {
            console.error('Error tracking event:', error);
        }
    }
}

export const userInteractionService = new UserInteractionService(ApiClient.getInstance());
