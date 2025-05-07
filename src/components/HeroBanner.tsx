import React from 'react';

interface HeroBannerProps {
  video: {
    title: string;
    thumbnail: string;
  };
  onPlay: () => void;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ video, onPlay }) => (
  <div className="relative w-full h-[60vw] max-h-[600px] min-h-[300px] flex items-end bg-black">
    <img
      src={video.thumbnail}
      alt={video.title}
      className="absolute inset-0 w-full h-full object-cover z-0"
      style={{ filter: 'brightness(0.6)' }}
    />
    <div className="relative z-10 p-8 max-w-2xl">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">{video.title}</h1>
      <button
        onClick={onPlay}
        className="bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-opacity-80 transition text-xl"
      >
        재생
      </button>
    </div>
  </div>
);

export default HeroBanner; 