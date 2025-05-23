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
import AdCreatePage from './components/AdCreatePage';

const FLOATING_ROUTES = [
  { name: '메인', path: '/' },
  { name: '프로필', path: '/profile' },
  { name: '구독', path: '/subscription' },
  { name: '광고관리', path: '/ad-management' },
];

function FloatingMenu() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed right-8 bottom-8 z-50 flex flex-col items-end gap-3">
      {/* TOP 버튼 */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="mb-2 w-12 h-12 flex items-center justify-center rounded-full bg-gray-800 text-white shadow-lg hover:bg-blue-600 transition text-2xl"
        title="맨 위로"
      >
        ▲
      </button>
      {/* 플로팅 메뉴 */}
      {open && (
        <div className="mb-2 bg-[#232323] rounded-lg shadow-lg p-2 flex flex-col gap-2 animate-fade-in">
          {FLOATING_ROUTES.map(route => (
            <button
              key={route.path}
              onClick={() => { navigate(route.path); setOpen(false); }}
              className="px-4 py-2 text-white text-sm rounded hover:bg-blue-600 text-left"
            >
              {route.name}
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-600 text-white shadow-xl text-3xl hover:bg-blue-700 transition"
        title="빠른 이동"
      >
        ≡
      </button>
    </div>
  );
}

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
        <Route path="/ad-create" element={<AdCreatePage />} />
      </Routes>
      <FloatingMenu />
    </div>
  );
}

export default App;
