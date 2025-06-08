import React from 'react';
import { VideoPreview } from '../types/video';

interface HeroBannerProps {
  video: VideoPreview;
  onPlay: () => void;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ video, onPlay }) => {
  return (
    <div className="relative w-full h-[70vh] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
      <img
        src={`https://img.youtube.com/vi/${video.videoId}/sddefault.jpg`}
        alt={video.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{video.title}</h1>
        <div className="flex gap-4 mb-6">
          <button
            onClick={onPlay}
            className="bg-white text-black px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-200 transition"
          >
            재생
          </button>
          <button className="bg-gray-600/80 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-600 transition">
            상세정보
          </button>
        </div>
        <p className="text-gray-300 text-sm md:text-base max-w-2xl">
          {video.genre.join(', ')}
        </p>
      </div>
    </div>
  );
};

export default HeroBanner; 