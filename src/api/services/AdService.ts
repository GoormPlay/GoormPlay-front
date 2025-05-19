import { ApiClient } from "../ApiClient";
import { Ad, AdvertiserAccountDTO, RechargeRequestDTO } from "../../types/Ad";


class AdService {
    private apiClient: ApiClient;
    private readonly FIXED_ADVERTISER_ID = 'ADV_001'; // 테스트용 고정 광고주 ID

    constructor(apiClient: ApiClient) {
        this.apiClient = apiClient;
    }
    
    async getAds() {
        // URL에 쿼리 파라미터로 advertiserId 추가
        return this.apiClient.get<Ad[]>('ADS', { advertiserId: this.FIXED_ADVERTISER_ID });
    }

    async createAd(formData: FormData) {
        return this.apiClient.postMultipart<Ad>('CREATE_AD', formData);
    }

    async rechargeBalance(amount: number) {
        const request: RechargeRequestDTO = {
            advertiserId: this.FIXED_ADVERTISER_ID,
            amount: amount
        };
        return this.apiClient.post<AdvertiserAccountDTO>('AD_RECHARGE', request);
    }

    async checkBalance() {
        return this.apiClient.get<AdvertiserAccountDTO>('AD_BALANCE', { advertiserId: this.FIXED_ADVERTISER_ID });
    }
}


export const adService = new AdService(ApiClient.getInstance());
    