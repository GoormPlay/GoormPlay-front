import ReactGA from 'react-ga4';
import { ApiClient } from '../api/ApiClient';
import { VideoEvent, Video } from '../types/video';

interface AnalyticsEvent {
    eventName: string;
    eventCategory: string;
    eventType: string;
    userId?: string;
    videoId?: string;
    timestamp?: string;
    page: string;
    VideoCategory?: string;
    rating?: number;
    review?: string;
    adType?: string;
    adId?: string;
}

// API 엔드포인트 추가
const ANALYTICS_ENDPOINTS = {
    EVENT_LOG: {
    path: '/logs/events',
    isPublic: true,
    service: 'analytics' as const,
  },
  VIDEO_LOG: {
    path: '/logs/video',
    isPublic: true,
    service: 'analytics' as const,
  },
  AD_LOG: {
    path: '/logs/ad',
    isPublic: true,
    service: 'analytics' as const,
  },
} as const;

