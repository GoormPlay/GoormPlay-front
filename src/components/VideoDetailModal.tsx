import React, {useState}from 'react';
import { Modal, Box, Button } from '@mui/material';
import { Video } from '../types/video';
import { Review } from '../types/Review';
import { useNavigate } from 'react-router-dom';

interface VideoDetailModalProps {
  open: boolean;
  video: any | null;
  onClose: () => void;
};

const dummyReviews: Review[] = [
  { id: 1, user: '베스트리뷰', rating: 5, comment: '정말 재미있어요!', date: '2024-06-12' },
  { id: 2, user: 'user123', rating: 4, comment: '만족스러운 영화!', date: '2024-06-10' },
  { id: 3, user: '익명', rating: 3, comment: '그냥 그랬음...', date: '2024-06-09' },
];

const VideoDetailModal: React.FC<VideoDetailModalProps> = ({ open, video, onClose }) => {
  const [reviews] = useState<Review[]>(dummyReviews);
  const navigate = useNavigate();
  console.log(open, video, video?.videoId)
  // 조건부 렌더링: video가 없으면 아무것도 렌더링하지 않음
  if (!open || !video || !video.videoId) return null;

  // 이 시점에서는 video와 video.videoId가 항상 있음!
  const previewUrl = `https://www.youtube.com/embed/${video.videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&start=0&end=10`;

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
          width: { xs: '95vw', sm: 700, md: 900 },
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
          <div className="md:w-2/3 w-full p-8">
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
                <button className="w-10 h-10 rounded-full bg-[#222] flex items-center justify-center hover:bg-[#333]">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" strokeWidth="2" />
                  </svg>
                </button>
                <button className="w-10 h-10 rounded-full bg-[#222] flex items-center justify-center hover:bg-[#333]">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M4 12v.01M12 4v.01M20 12v.01M12 20v.01M7.05 7.05v.01M16.95 7.05v.01M16.95 16.95v.01M7.05 16.95v.01" strokeWidth="2" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="text-gray-400 mb-4">
              <span>4.0</span>
              <span className="mx-2">|</span>
              <span>드라마</span>
              <span className="mx-2">|</span>
              <span>2018</span>
              <span className="mx-2">|</span>
              <span>2시간 14분</span>
              <span className="mx-2">|</span>
              <span>12세</span>
            </div>
            <button 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-xl mb-6"
            onClick={() => {
              if(video && video.videoId){
              navigate(`/watch/${video.videoId}`)
            }
          }}
            >
              재생하기
            </button>
            {/* 비슷한 영화 슬라이더 (임시) */}
            <div>
              <h3 className="text-xl font-bold mb-2">비슷한 영화</h3>
              <div className="flex gap-4 overflow-x-auto">
                {/* 임시 썸네일 */}
                {[1,2,3,4,5].map((n) => (
                  <div key={n} className="w-32 h-48 bg-[#222] rounded-lg flex-shrink-0 overflow-hidden">
                    <img src={`https://img.youtube.com/vi/${video.videoId}/sddefault.jpg`} alt="비슷한 영화" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* 오른쪽: 리뷰/평점 */}
          <div className="md:w-1/3 w-full bg-[#111] p-8 border-l border-[#222] flex flex-col">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-bold">직관</span>
                <span className="text-yellow-400 text-2xl">★ 4.0</span>
                <span className="text-gray-400 text-sm">(119명 참여)</span>
              </div>
              <div className="flex gap-1 mb-2">
                {[1,2,3,4,5].map((n) => (
                  <span key={n} className={n <= 4 ? "text-yellow-400 text-xl" : "text-gray-600 text-xl"}>★</span>
                ))}
              </div>
              <div className="text-gray-300 text-sm mb-2">
                지금은 직접작성만! 리뷰를 솔직하게 작성해주세요.<br />
                곧 AI 리뷰 생성/추천 기능도 도입됩니다.
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <h4 className="text-lg font-bold mb-2">베스트 리뷰</h4>
              {reviews.map((r) => (
                <div key={r.id} className="mb-4 pb-4 border-b border-[#222]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold">{r.user}</span>
                    <span className="text-yellow-400">{'★'.repeat(r.rating)}</span>
                    <span className="text-gray-400 text-xs">{r.date}</span>
                  </div>
                  <div className="text-gray-200">{r.comment}</div>
                </div>
              ))}
            </div>
            {/* 리뷰 작성 버튼 (임시) */}
            <button className="mt-4 bg-[#222] hover:bg-[#333] text-white py-2 rounded-lg font-bold">
              리뷰 작성하기
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default VideoDetailModal; 