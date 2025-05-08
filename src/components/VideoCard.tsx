import React from 'react';
import { motion } from 'framer-motion';
import { Video } from '../types/video';

interface VideoCardProps {
  video: Video;
  onClick: (video: Video) => void;
  rank?: number;
  badge?: string;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onClick, rank, badge}) => {
  return (
    <motion.div
    whileHover={{ scale: 1.08, zIndex: 2 }}
    className="relative cursor-pointer group rounded-lg overflow-hidden shadow-lg"
    onClick={() => onClick(video)}
    style={{ aspectRatio: '2/3', minWidth: 180, maxWidth: 220 }}
  >
      <img
        src={`https://img.youtube.com/vi/${video.videoId}/sddefault.jpg`}
        alt={video.title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
     {/* 랭킹 */}
    {rank && (
      <span className="absolute left-2 top-2 text-5xl font-extrabold text-white/30 z-10 select-none pointer-events-none">
        {rank}
      </span>
    )}
    {/* 뱃지 */}
    {badge && (
      <span className="absolute right-2 top-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
        {badge}
      </span>
    )}
    {/* 제목 */}
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
      <span className="text-white font-bold text-lg">{video.title}</span>
    </div>
    </motion.div>
  );
};

export default VideoCard; 