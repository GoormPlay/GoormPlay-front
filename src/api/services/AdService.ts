import { ApiClient } from "../ApiClient";
import { Ad } from "../../types/Ad";

class AdService {
    private apiClient: ApiClient;

    constructor(apiClient: ApiClient) {
        this.apiClient = apiClient;
    }
    
    async getAds() {
        return this.apiClient.get<Ad[]>('ADS');
      }
    //   async getAd(id: string) {
    //     return this.apiClient.get<Ad>(`ADS/${id}`);
    //   }
      
}

export const adService = new AdService(
    ApiClient.getInstance({
        baseURL: process.env.REACT_APP_API_URL || '',
        serviceBaseURLs: {
          ad: process.env.REACT_APP_AD_API_URL || '',
        },
    })
  );