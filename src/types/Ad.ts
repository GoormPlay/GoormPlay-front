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