import React, { useCallback, useEffect, useRef, useState } from 'react';
import { VideoEvent, VideoEventType } from '../types/video';
import { ContentDetailResponse, Review } from '../api/types';
import { videoService } from '../api/services/VideoService';
import { userInteractionService } from '../api/services/UserInteractionService';
import { reviewService } from '../api/services/ReviewService';
import { useNavigate } from 'react-router-dom';
import { Modal, Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Rating } from '@mui/material';

interface VideoDetailModalProps {
  videoId: string | null;
  onClose: () => void;
}

const VideoDetailModal: React.FC<VideoDetailModalProps> = ({ videoId, onClose }) => {
  const [contentDetail, setContentDetail] = useState<ContentDetailResponse | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!videoId) return;

    const loadVideoDetail = async () => {
      try {
        const response = await videoService.getContentDetail(videoId);
        setContentDetail(response);
        setIsLiked(response.isLiked);
      } catch (error) {
        console.error('Error loading video detail:', error);
        onClose();
      }
    };

    loadVideoDetail();
  }, [videoId, onClose]);

  const handleLikeClick = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      const shouldLogin = window.confirm('로그인이 필요한 서비스입니다. 로그인하시겠습니까?');
      if (shouldLogin) {
        navigate('/login');
      }
      return;
    }

    try {
      await userInteractionService.updateLike(videoId!);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('좋아요 업데이트 실패:', error);
      alert('좋아요 상태 변경에 실패했습니다.');
    }
  };

  const handleReviewClick = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      const shouldLogin = window.confirm('로그인이 필요한 서비스입니다. 로그인하시겠습니까?');
      if (shouldLogin) {
        navigate('/login');
      }
      return;
    }
    setIsReviewDialogOpen(true);
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setReviewText(review.comment);
    setReviewRating(review.rating);
    setIsReviewDialogOpen(true);
  };

  const handleDeleteReview = async (review: Review) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      const shouldLogin = window.confirm('로그인이 필요한 서비스입니다. 로그인하시겠습니까?');
      if (shouldLogin) {
        navigate('/login');
      }
      return;
    }

    try {
      await reviewService.deleteReview(videoId!);
      const response = await videoService.getContentDetail(videoId!);
      setContentDetail(response);
    } catch (error) {
      console.error('리뷰 삭제 실패:', error);
      alert('리뷰 삭제에 실패했습니다.');
    }
  };

  const handleReviewSubmit = async () => {
    if (!reviewText || reviewRating === 0) {
      alert('리뷰 내용과 별점을 모두 입력해주세요.');
      return;
    }

    try {
      if (editingReview) {
        await reviewService.updateReview(videoId!, {
          id: editingReview.id!,
          comment: reviewText,
          rating: reviewRating
        });
      } else {
        await reviewService.createReview(videoId!, {
          comment: reviewText,
          rating: reviewRating
        });
      }

      const response = await videoService.getContentDetail(videoId!);
      setContentDetail(response);
      setIsReviewDialogOpen(false);
      setEditingReview(null);
      setReviewText('');
      setReviewRating(0);
    } catch (error) {
      console.error('리뷰 작성/수정 실패:', error);
      alert('리뷰 작성/수정에 실패했습니다.');
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (!contentDetail?.content) return null;

  const video = contentDetail.content;
  const previewUrl = `https://www.youtube.com/embed/${video.videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&start=0&end=10`;

  return (
    <>
      <Modal open={!!videoId} onClose={handleClose}>
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
            width: { xs: '95vw', sm: 700, md: 900 },
            maxWidth: '95vw',
            height: 'auto',
            maxHeight: '90vh',
            p: 0,
            outline: 'none',
            overflow: 'auto',
          }}
        >
          <div className="w-full aspect-video bg-black rounded-lg overflow-hidden mb-6 relative">
            <iframe
              title="미리보기"
              src={previewUrl}
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="w-full h-full"
              style={{ border: 0 }}
            />
          </div>

          {/* 이 아래는 필요 시 좋아요, 리뷰, 상세정보 등을 추가하는 공간 */}
        </Box>
      </Modal>

      {/* 리뷰 작성/수정 다이얼로그 */}
      <Dialog 
        open={isReviewDialogOpen} 
        onClose={() => {
          setIsReviewDialogOpen(false);
          setEditingReview(null);
          setReviewText('');
          setReviewRating(0);
        }}
        PaperProps={{
          style: {
            backgroundColor: '#181818',
            color: 'white',
          },
        }}
      >
        <DialogTitle>
          {editingReview ? '리뷰 수정하기' : '리뷰 작성하기'}
        </DialogTitle>
        <DialogContent>
          <div className="mt-4">
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">별점</label>
              <Rating
                value={reviewRating}
                onChange={(_, value) => setReviewRating(value || 0)}
                precision={0.5}
                sx={{
                  '& .MuiRating-iconFilled': {
                    color: '#fbbf24',
                  },
                  '& .MuiRating-iconHover': {
                    color: '#fbbf24',
                  },
                }}
              />
            </div>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="리뷰를 작성해주세요 (10자 이상)"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: '#333',
                  },
                  '&:hover fieldset': {
                    borderColor: '#444',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#666',
                  },
                },
              }}
            />
          </div>
        </DialogContent>
        <DialogActions sx={{ padding: 2 }}>
          <button
            className="px-4 py-2 text-gray-400 hover:text-white"
            onClick={() => {
              setIsReviewDialogOpen(false);
              setEditingReview(null);
              setReviewText('');
              setReviewRating(0);
            }}
          >
            취소
          </button>
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            onClick={handleReviewSubmit}
          >
            {editingReview ? '수정하기' : '작성하기'}
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default VideoDetailModal;
