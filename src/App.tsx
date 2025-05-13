import React, { useEffect, useState } from 'react';
import HeroBanner from './components/HeroBanner';
import SectionSlider from './components/SectionSlider';
import VideoDetailModal from './components/VideoDetailModal';
import { videoService } from './api/services/VideoService'; 
import { Video } from './types/video';
import NavBar from './components/NavBar';
import { Route, Routes, useNavigate } from 'react-router-dom';
import WatchPage from './components/WatchPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ProfilePage from './components/ProfilePage';
import SubscriptionPage from './components/SubscriptionPage';
import AdManagementPage from './components/AdManagementPage';
import AdSidebar from './components/AdSidebar';
import AdBudgetPage from './pages/AdBudgetPage';
import BannerContentPage from './pages/BannerContentPage'; 

function MainPage({ videos, setSelectedVideo }: { videos: Video[], setSelectedVideo: (v: Video) => void }) {
  const [trending, setTrending] = useState<Video[]>([]);
  const [latest, setLatest] = useState<Video[]>([]);
  const [recommend, setRecommend] = useState<Video[]>([]);
  // const [ads, setAds] = useState<Ad[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // videoService.getTrending().then(setTrending);
    // videoService.getLatest().then(setLatest);
    // videoService.getRecommend().then(setRecommend);
    // videoService.getAds().then(setAds);
  }, []);
  return (
    <>
      <NavBar />
      <div className="pt-16">
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
        <div className="w-full flex justify-center py-8">
          <img src="/banner-bottom.png" alt="광고" className="rounded-lg" />
        </div>
      </div>
    </>
  );
}

function AdLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#141414]">
      <AdSidebar />
      <div className="flex-1 p-8 pt-20"> {children} </div>
    </div>
  );
}

function App() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    videoService.getLatest().then(setVideos);
  }, []);

  return (
    <div className="bg-[#141414] min-h-screen">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <MainPage videos={videos} setSelectedVideo={setSelectedVideo} />
              <VideoDetailModal
                open={!!selectedVideo}
                video={selectedVideo}
                onClose={() => setSelectedVideo(null)}
              />
            </>
          }
        />
        <Route path="/watch/:videoId" element={<WatchPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/subscription" element={<SubscriptionPage />} />
        <Route path="/ad-management" element={<AdLayout><AdManagementPage /></AdLayout>} />
        <Route path="/ad-budget" element={<AdLayout><AdBudgetPage /></AdLayout>} />
        <Route path="/banner-content" element={<AdLayout><BannerContentPage /></AdLayout>} />
      </Routes>
    </div>
  );
}

export default App;
