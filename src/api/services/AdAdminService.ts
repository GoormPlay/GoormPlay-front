import { ApiClient } from '../ApiClient';
import { Ad, AdvertiserAccountDTO, RechargeRequestDTO } from '../types';

class AdAdminService {
  private apiClient: ApiClient;
  private readonly FIXED_ADVERTISER_ID = 'ADV_001'; // 테스트용 고정 광고주 ID

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async getAds(): Promise<Ad[]> {
    try {
      const response = await this.apiClient.get<Ad[]>('ADS', null, {
        params: { advertiserId: this.FIXED_ADVERTISER_ID }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching ads:', error);
      throw error;
    }
  }

  async createAd(formData: FormData): Promise<Ad> {
    try {
      const response = await this.apiClient.postMultipart<Ad>('CREATE_AD', formData);
      return response.data;
    } catch (error) {
      console.error('Error creating ad:', error);
      throw error;
    }
  }

  async rechargeAd(amount: number): Promise<void> {
    try {
      const request: RechargeRequestDTO = {
        advertiserId: this.FIXED_ADVERTISER_ID,
        amount: amount
      };
      await this.apiClient.post('AD_RECHARGE', request);
    } catch (error) {
      console.error('Error recharging ad:', error);
      throw error;
    }
  }

  async getAdBalance(): Promise<AdvertiserAccountDTO> {
    try {
      const response = await this.apiClient.get<AdvertiserAccountDTO>('AD_BALANCE', null, {
        params: { advertiserId: this.FIXED_ADVERTISER_ID }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching ad balance:', error);
      throw error;
    }
  }
}

export const adAdminService = new AdAdminService(ApiClient.getInstance()); 