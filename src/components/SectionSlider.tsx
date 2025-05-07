import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import VideoCard from './VideoCard';

interface SectionSliderProps {
  title: string;
  videos: any[];
  showRank?: boolean;
  onCardClick: (video: any) => void;
}

const SectionSlider: React.FC<SectionSliderProps> = ({ title, videos, showRank, onCardClick }) => (
  <section className="mb-10">
    <h2 className="text-2xl font-bold mb-4">{title}</h2>
    <Swiper spaceBetween={16} slidesPerView="auto">
      {videos.map((video, idx) => (
        <SwiperSlide key={video.id} style={{ width: 220 }}>
          <VideoCard
            video={video}
            onClick={() => onCardClick(video)}
            rank={showRank ? idx + 1 : undefined}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  </section>
);

export default SectionSlider; 