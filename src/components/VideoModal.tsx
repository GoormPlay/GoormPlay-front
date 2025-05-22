import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VideoEvent, VideoEventType } from '../types/video';
import { Video } from '../api/types';
import { videoService } from '../api/services/VideoService';

interface VideoModalProps {
  video: Video | null;
  onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ video, onClose }) => {
  const playerRef = useRef<YT.Player | null>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!video) return;

    const loadYouTubeAPI = () => {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    };

    if (!window.YT) {
      loadYouTubeAPI();
    }

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player('youtube-player', {
        height: '100%',
        width: '100%',
        videoId: video.videoId,
        playerVars: {
          autoplay: 1,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: () => setIsPlayerReady(true),
          onStateChange: (event: { data: number }) => handlePlayerStateChange(event.data),
        },
      });
    };

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [video]);

  const trackEvent = async (eventType: VideoEventType) => {
    if (!video || !playerRef.current) return;

    const event: VideoEvent = {
      videoId: video.videoId,
      eventType,
      timestamp: new Date().toISOString(),
      currentTime: playerRef.current.getCurrentTime(),
    };

    try {
      await videoService.trackEvent(event);
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  };

  const handlePlayerStateChange = (state: number) => {
    if (!playerRef.current) return;

    switch (state) {
      case window.YT.PlayerState.PLAYING:
        trackEvent('play');
        intervalRef.current = setInterval(() => trackEvent('time'), 5000);
        break;
      case window.YT.PlayerState.PAUSED:
        trackEvent('pause');
        if (intervalRef.current) clearInterval(intervalRef.current);
        break;
      case window.YT.PlayerState.ENDED:
        trackEvent('end');
        if (intervalRef.current) clearInterval(intervalRef.current);
        break;
    }
  };

  const handleClose = () => {
    if (playerRef.current) {
      trackEvent('exit');
      playerRef.current.destroy();
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {video && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="relative w-full max-w-6xl aspect-video bg-black rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div id="youtube-player" className="w-full h-full" />
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white hover:text-gray-300 bg-black/50 rounded-full p-2"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VideoModal; 