import { ApiClient } from "../ApiClient";
import { InteractionRequestDto, ContentClickEventDto, VideoEventType, VideoEventDto } from "../types";

class UserInteractionService {
    private apiClient: ApiClient;

    constructor(apiClient: ApiClient) {
        this.apiClient = apiClient;
    }

    async updateLike(videoId: string) {
        const requestDto: InteractionRequestDto = {
            videoId,
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
            videoId,
            timestamp: new Date().toISOString(),
            trending: isTrending,
            latest: isLatest,
            recommended: isRecommended,
            genre: genre
        };
        return this.apiClient.post<void>('CONTENT_CLICK', requestDto);
    }

    async trackEvent(videoId: string, eventType: VideoEventType, timestamp: string, watchProgress: number) {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        try {
            const requestDto: VideoEventDto = {
                videoId,
                timestamp,
                eventType,
                watchProgress
            };
            await this.apiClient.post<void>('TRACK_EVENT', requestDto, { params: { videoId } });
        } catch (error) {
            console.error('Error tracking event:', error);
        }
    }
}

export const userInteractionService = new UserInteractionService(ApiClient.getInstance());
