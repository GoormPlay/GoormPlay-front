import { ApiClient } from "../ApiClient";
import { BannerAd } from '../types';

class AdService {
    private apiClient: ApiClient;

    constructor(apiClient: ApiClient) {
        this.apiClient = apiClient;
    }

    async getBannerAd(): Promise<BannerAd | null> {
        try {
            const response = await this.apiClient.get<BannerAd>('BANNER_AD');
            return response.data;
        } catch (error) {
            console.error('Error fetching banner ad:', error);
            return null;
        }
    }
}

export const adService = new AdService(ApiClient.getInstance());
    