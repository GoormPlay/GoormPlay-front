import React from 'react';
import { motion } from 'framer-motion';
import { Video } from '../types/video';

interface VideoCardProps {
  video: Video;
  onClick: (video: Video) => void;
  rank?: number;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onClick, rank }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.1, zIndex: 1 }}
      whileTap={{ scale: 0.95 }}
      className="relative cursor-pointer group"
      onClick={() => onClick(video)}
      style={{ aspectRatio: '2/3', minWidth: 180, maxWidth: 220 }}
    >
      <img
        src={`https://img.youtube.com/vi/${video.videoId}/sddefault.jpg`}
        alt={video.title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {rank && (
          <span className="absolute left-2 top-2 text-[5rem] font-extrabold text-white/20 z-10 select-none pointer-events-none">
            {rank}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default VideoCard; 