import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import VideoCard from './VideoCard';
import { Video } from '../api/types';
import { userInteractionService } from '../api/services/UserInteractionService';

interface SectionSliderProps {
  title: string;
  videos: Video[];
  showRank?: boolean;
  onCardClick: (video: Video) => void;
  sectionType?: 'trending' | 'latest' | 'recommend';
}

const SectionSlider: React.FC<SectionSliderProps> = ({ 
  title, 
  videos, 
  showRank, 
  onCardClick,
  sectionType 
}) => {
  const sliderId = `slider-${sectionType || 'default'}`;

  const handleCardClick = async (video: Video) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        await userInteractionService.trackContentClick(
          video.id,
          sectionType === 'trending',
          sectionType === 'latest',
          sectionType === 'recommend',
          video.genre
        );
      } catch (error) {
        console.error('Error tracking content click:', error);
      }
    }
    onCardClick(video);
  };

  console.log('SectionSlider videos:', videos); // 디버깅용 로그
  return (
    <section className="mb-10 relative group">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="relative">
        <Swiper
          spaceBetween={16}
          slidesPerView="auto"
          navigation={{
            nextEl: `.${sliderId}-next`,
            prevEl: `.${sliderId}-prev`,
          }}
          modules={[Navigation, Autoplay]}
          loop={true}
          className="relative"
        >
          {videos.map((video, idx) => (
            <SwiperSlide key={video.id} style={{ width: 220 }}>
              <VideoCard
                video={video}
                onClick={() => handleCardClick(video)}
                rank={showRank ? idx + 1 : undefined}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        {/* 네비게이션 버튼 */}
        <div className={`swiper-button-prev ${sliderId}-prev !w-12 !h-12 !bg-black/50 !rounded-full !text-white after:!text-xl`}></div>
        <div className={`swiper-button-next ${sliderId}-next !w-12 !h-12 !bg-black/50 !rounded-full !text-white after:!text-xl`}></div>
      </div>
    </section>
  );
};

export default SectionSlider; 