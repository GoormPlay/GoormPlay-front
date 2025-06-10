import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BannerAd, AdEvent } from '../api/types';
import { VideoPreview } from '../types/video';
import { videoService } from '../api/services/VideoService';
import { adService } from '../api/services/AdService';
import { userInteractionService } from '../api/services/UserInteractionService';
import HeroBanner from './HeroBanner';

interface MainPageProps {
  onVideoSelect: (videoId: string) => void;
}

const MainPage: React.FC<MainPageProps> = ({ onVideoSelect }) => {
  const [trendingVideos, setTrendingVideos] = useState<VideoPreview[]>([]);
  const [latestVideos, setLatestVideos] = useState<VideoPreview[]>([]);
  const [recommendedVideos, setRecommendedVideos] = useState<VideoPreview[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [bannerAd, setBannerAd] = useState<BannerAd | null>(null);
  const navigate = useNavigate();

  // 비디오 로드
  const loadVideos = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const response = await videoService.getLatest(page);
      if (response.contents.length === 0 || response.isLast) {
        setHasMore(false);
      } else {
        // 페이지 번호에 따라 다른 섹션에 추가
        if (page === 0) {
          setTrendingVideos(response.contents.slice(0, 4));
          setLatestVideos(response.contents.slice(4, 8));
          setRecommendedVideos(response.contents.slice(8, 12));
        } else {
          setLatestVideos(prev => [...prev, ...response.contents]);
        }
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('비디오 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page]);

  // 배너 광고 로드
  const loadBannerAd = async () => {
    try {
      const ad = await adService.getBannerAd();
      if (ad) {
        setBannerAd(ad);
        // 광고 노출 이벤트 로깅
        const adEvent: AdEvent = {
          adId: ad.id,
          eventType: 'ad_impression',
          timestamp: new Date().toISOString(),
          userId: localStorage.getItem('userId') || 'anonymous',
          adType: ad.adType,
          page: 'main'
        };
        await userInteractionService.trackAdEvent(adEvent);
      }
    } catch (error) {
      console.error('배너 광고 로드 실패:', error);
    }
  };

  useEffect(() => {
    loadVideos();
    loadBannerAd();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1000) {
        loadVideos();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadVideos]);

  // 광고 클릭 핸들러
  const handleAdClick = async (ad: BannerAd) => {
    try {
      // 광고 클릭 이벤트 로깅
      const adEvent: AdEvent = {
        adId: ad.id,
        eventType: 'ad_click',
        timestamp: new Date().toISOString(),
        userId: localStorage.getItem('userId') || 'anonymous',
        adType: ad.adType,
        page: 'main'
      };
      await userInteractionService.trackAdEvent(adEvent);
      // 광고 링크로 이동
      window.open(ad.link, '_blank');
    } catch (error) {
      console.error('광고 클릭 이벤트 로깅 실패:', error);
    }
  };

  const renderVideoGrid = (videos: VideoPreview[], title: string) => (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {videos.map((video, index) => (
          <div
            key={`${video.videoId}-${index}`}
            className="bg-[#232323] rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform"
            onClick={() => onVideoSelect(video.videoId)}
          >
            <img
              src={`https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`}
              alt={video.title}
              className="w-full aspect-video object-cover"
            />
            <div className="p-4">
              <h3 className="text-white font-semibold line-clamp-2">{video.title}</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {video.genre.map((g, i) => (
                  <span key={i} className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* HeroBanner */}
      {trendingVideos[0] && (
        <HeroBanner 
          video={trendingVideos[0]} 
          onPlay={() => onVideoSelect(trendingVideos[0].videoId)} 
        />
      )}

      {/* 배너 광고 섹션 */}
      <div className="mb-8">
        {bannerAd ? (
          <div 
            className="relative w-full h-48 bg-[#232323] rounded-lg overflow-hidden cursor-pointer"
            onClick={() => handleAdClick(bannerAd)}
          >
            <img
              src={bannerAd.thumbnailUrl}
              alt={bannerAd.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="relative w-full h-48 bg-[#232323] rounded-lg overflow-hidden">
            <img
              src="/ad-sample.png"
              alt="기본 광고"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* 비디오 섹션들 */}
      {renderVideoGrid(trendingVideos, '트렌딩')}
      {renderVideoGrid(latestVideos, '최신')}
      {renderVideoGrid(recommendedVideos, '추천')}

      {/* 로딩 인디케이터 */}
      {loading && (
        <div className="flex justify-center mt-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  );
};

export default MainPage; 