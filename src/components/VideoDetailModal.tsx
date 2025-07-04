import React, { useEffect, useState } from 'react';
import { ContentDetailResponse, Review } from '../api/types';
import { videoService } from '../api/services/VideoService';
import { userInteractionService } from '../api/services/UserInteractionService';
import { reviewService } from '../api/services/ReviewService';
import { useNavigate } from 'react-router-dom';
import { Modal, Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Rating } from '@mui/material';
import { VideoPreview } from '../types/video';
import 'swiper/css';
import 'swiper/css/navigation';
import SectionSlider from './SectionSlider';

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
  const [recommendVideos, setRecommendVideos] = useState<VideoPreview[]>([]);
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
    // 추천 비디오 불러오기 (18~24번째)
    videoService.getLatest(3, 6).then(res => {
      setRecommendVideos(res.contents);
    });
    // Re-scroll to top when videoId changes
    const box = document.querySelector('.MuiBox-root');
    if (box) {
      box.scrollTop = 0;
    }
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
    try {
      await reviewService.deleteReview(review.id!);
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
            width: { xs: '95vw', sm: '90vw', md: 1200 },
            maxWidth: '95vw',
            height: 'auto',
            maxHeight: '90vh',
            p: 0,
            outline: 'none',
            overflow: 'auto',
          }}
        >
          <div className="flex flex-col md:flex-row w-full h-full">
            {/* 왼쪽: 썸네일/정보 */}
            <div className="md:w-2/3 w-full p-8 flex flex-col">
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
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-3xl font-extrabold">{video.title}</h2>
                <div className="flex gap-2">
                  <button 
                    className={`w-10 h-10 rounded-full ${isLiked ? 'bg-red-600' : 'bg-[#222]'} flex items-center justify-center hover:bg-[#333]`}
                    onClick={handleLikeClick}
                  >
                    <svg className="w-6 h-6 text-white" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" strokeWidth="2" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="text-gray-400 mb-4">
                <span>{contentDetail.averageRating.toFixed(1)}</span>
                <span className="mx-2">|</span>
                <span>{video.genre.join(', ')}</span>
                <span className="mx-2">|</span>
                <span>{video.year}</span>
                <span className="mx-2">|</span>
                <span>{video.KMRB}</span>
              </div>
              <p className="text-gray-300 mb-6">{video.synopsis}</p>
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-xl mb-6"
                onClick={() => navigate(`/watch/${video.videoId}`)}
              >
                재생하기
              </button>
              {recommendVideos.length > 0 && (
  <SectionSlider
    title="함께 시청할 만한 콘텐츠"
    videos={recommendVideos}
    showRank={false}
    onCardClick={(video) => navigate(`/watch/${video.videoId}`)}
    sectionType="recommend"
  />
)}
            </div>

            {/* 오른쪽: 리뷰/평점 */}
            <div className="md:w-1/3 w-full bg-[#111] p-8 border-l border-[#222] flex flex-col">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-bold">직관</span>
                  <span className="text-yellow-400 text-2xl">★ {contentDetail.averageRating.toFixed(1)}</span>
                  <span className="text-gray-400 text-sm">({contentDetail.reviews.length}명 참여)</span>
                </div>
                <div className="flex gap-1 mb-2">
                  {[1,2,3,4,5].map((n) => (
                    <span key={n} className={n <= Math.round(contentDetail.averageRating) ? "text-yellow-400 text-xl" : "text-gray-600 text-xl"}>★</span>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                <h4 className="text-lg font-bold mb-2">베스트 리뷰</h4>
                {contentDetail.reviews.length > 0 ? (
                  contentDetail.reviews.map((review) => {
                    const currentUsername = localStorage.getItem('username');
                    const isAuthor = currentUsername === review.username;

                    return (
                      <div key={review.id} className="mb-4 pb-4 border-b border-[#222]">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{review.username}</span>
                            <span className="text-yellow-400">{'★'.repeat(review.rating)}</span>
                            <span className="text-gray-400 text-xs">{review.createdAt}</span>
                          </div>
                          {isAuthor && (
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleEditReview(review)}
                                className="text-blue-400 hover:text-blue-300 text-sm"
                              >
                                수정
                              </button>
                              <button 
                                onClick={() => handleDeleteReview(review)}
                                className="text-red-400 hover:text-red-300 text-sm"
                              >
                                삭제
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="text-gray-200">{review.comment}</div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <p className="text-lg mb-2">아직 리뷰가 없습니다</p>
                    <p className="text-sm">첫 번째 리뷰를 작성해보세요!</p>
                  </div>
                )}
              </div>

              <button 
                className="mt-4 bg-[#222] hover:bg-[#333] text-white py-2 rounded-lg font-bold"
                onClick={handleReviewClick}
              >
                {editingReview ? '리뷰 수정' : '리뷰 작성'}
              </button>
            </div>
          </div>
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
          {editingReview ? '리뷰 수정' : '리뷰 작성'}
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
              placeholder="리뷰를 작성해주세요"
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
