import React, { useEffect, useState } from 'react';
import HeroBanner from './components/HeroBanner';
import SectionSlider from './components/SectionSlider';
import VideoDetailModal from './components/VideoDetailModal';
import { videoService } from './api/services/videoService';
import { Video } from './types/video';
import NavBar from './components/NavBar';
function App() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    videoService.getVideos().then(setVideos);
  }, []);

  return (
    <div className="bg-[#141414] min-h-screen">
    <NavBar />
    <div className="pt-16"> {/* NavBar 높이만큼 패딩 */}
    {videos[0] && (
      <HeroBanner video={videos[0]} onPlay={() => setSelectedVideo(videos[0])} />
    )}
    <div className="container mx-auto px-4">
      <SectionSlider
        title="오늘 대한민국의 TOP 10 시리즈"
        videos={videos.slice(0, 6)}
        showRank={false}
        onCardClick={setSelectedVideo}
      />
      <SectionSlider
        title="회원님을 위해 엄선한 오늘의 콘텐츠"
        videos={videos.slice(6, 12)}
        showRank={false}
        onCardClick={setSelectedVideo}
      />
       <SectionSlider
        title="GoormPlay에 새로 올라온 콘텐츠"
        videos={videos.slice(6, 12)}
        showRank={false}
        onCardClick={setSelectedVideo}
      />
    </div>
    {/* 하단 광고 배너 등 추가 */}
    <div className="w-full flex justify-center py-8">
      <img src="/banner-bottom.png" alt="광고" className="rounded-lg" />
    </div>
    <VideoDetailModal
      open={!!selectedVideo}
      video={selectedVideo}
      onClose={() => setSelectedVideo(null)}
    />
    </div>
  </div>
  );
}

export default App;
