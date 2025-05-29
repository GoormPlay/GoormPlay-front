import { ApiClient } from '../ApiClient';
import { CreateReviewRequest, UpdateReviewRequest } from '../types';

class ReviewService {
    private apiClient: ApiClient;

    constructor(apiClient: ApiClient) {
        this.apiClient = apiClient;
    }

    // 아래 메서드는 BFF 없이 content와 review 서비스가 분리될 때 사용하세요.
    // 현재는 getContentDetail에서 리뷰까지 함께 내려주므로 사용하지 않습니다.
    // async getReviews(contentId: string) {
    //     return this.apiClient.get<Review[]>('GET_REVIEWS', { contentId });
    // }

    async createReview(contentId: string, request: CreateReviewRequest) {
        return this.apiClient.post<void>('CREATE_REVIEW', request, { params: { contentId } });
    }

    async updateReview(contentId: string, request: UpdateReviewRequest) {
        return this.apiClient.patch<void>('UPDATE_REVIEW', request, { params: { contentId } });
    }

    async deleteReview(reviewId: string) {
        return this.apiClient.delete<void>('DELETE_REVIEW', { params: { reviewId } });
    }
}

export const reviewService = new ReviewService(ApiClient.getInstance()); 