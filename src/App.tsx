import React, { useEffect, useState } from 'react';
import HeroBanner from './components/HeroBanner';
import SectionSlider from './components/SectionSlider';
import VideoDetailModal from './components/VideoDetailModal';
import { videoService } from './api/services/videoService';
import { Video } from './types/video';

function App() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    videoService.getVideos().then(setVideos);
  }, []);

  return (
    <div className="bg-[#141414] min-h-screen">
      {/* Hero Banner */}
      {videos[0] && (
        <HeroBanner video={videos[0]} onPlay={() => setSelectedVideo(videos[0])} />
      )}
      <div className="container mx-auto px-4">
        {/* TOP 10 Section */}
        <SectionSlider
          title="오늘 대한민국의 TOP 10 시리즈"
          videos={videos.slice(0, 10)}
          showRank
          onCardClick={setSelectedVideo}
        />
        {/* 추천 콘텐츠 Section */}
        <SectionSlider
          title="회원님을 위해 엄선한 오늘의 콘텐츠"
          videos={videos.slice(10, 20)}
          onCardClick={setSelectedVideo}
        />
        {/* 새로 올라온 콘텐츠 Section */}
        <SectionSlider
          title="넷플릭스에 새로 올라온 콘텐츠"
          videos={videos.slice(20, 30)}
          onCardClick={setSelectedVideo}
        />
      </div>
      {/* 상세 모달 */}
      <VideoDetailModal
        open={!!selectedVideo}
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </div>
  );
}

export default App;
