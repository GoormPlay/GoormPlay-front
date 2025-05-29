export interface Ad {
    id: string;
    adSnId: string;
    type: 'A' | 'B'
    title: string;
    thumbnailUrl: string;
    link: string;
    impressions: number;
    clicks: number;
    cpc: number;
    balance: number;
}
//광고 예산 관련
export interface RechargeRequestDTO {
    advertiserId: string;
    amount: number;
  }
  
  export interface AdvertiserAccountDTO {
    advertiserId: string;
    totalBudget: number;
    currentBalance: number;
    createdAt: string;
  }
