import React from 'react';
import { Modal, Box, Button } from '@mui/material';

interface VideoDetailModalProps {
  open: boolean;
  video: any | null;
  onClose: () => void;
}

const VideoDetailModal: React.FC<VideoDetailModalProps> = ({ open, video, onClose }) => {
  if (!video) return null;
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: '#181818',
          color: 'white',
          borderRadius: 2,
          boxShadow: 24,
          width: { xs: '98vw', md: 1000 },
          maxWidth: '98vw',
          p: 0,
          outline: 'none',
        }}
      >
        <div className="w-full bg-black rounded-t-lg overflow-hidden" style={{ aspectRatio: '16/7', minHeight: 320, maxHeight: 500 }}>
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1`}
            title={video.title}
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="w-full h-full"
            style={{ minHeight: 320, maxHeight: 500 }}
          />
        </div>
        <div className="p-8">
          <h2 className="text-3xl font-extrabold mb-2">{video.title}</h2>
          <p className="mb-6 text-lg text-gray-200">{video.description}</p>
          <Button
            variant="contained"
            color="error"
            onClick={onClose}
            sx={{
              fontWeight: 'bold',
              fontSize: '1.1rem',
              borderRadius: 2,
              px: 4,
              py: 1.5,
              background: '#e50914',
              '&:hover': { background: '#b0060f' },
            }}
          >
            닫기
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default VideoDetailModal; 