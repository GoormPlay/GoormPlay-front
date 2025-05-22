import React, {useEffect, useState} from "react";
import { userService } from "../api/services/UserService";
import { MemberProfileDto, Video } from "../api/types";
import SectionSlider from "./SectionSlider";
import { useNavigate } from "react-router-dom";

const dummyProfile: MemberProfileDto = {
    id: '1',
    username: 'default',
    gender: 'MALE',
    age: 20,
    // createdAt: new Date().toISOString(),
    subscription_start_date: undefined,
  subscription_end_date: undefined,
  isCancelScheduled: false,
  isSubscribed: false,
    liked: [{
        "id": "1",
        "kind": "MOVIE",
        "genre": ["SF", "액션", "드라마"],
        "thumbnail": "https://www.youtube.com/embed/YoHD9XEInc0",
        "title": "인셉션",
        "videoId": "YoHD9XEInc0",
        "synopsis": "꿈을 공유하는 특수한 기술을 통해 타인의 꿈에 침투하는 도둑의 이야기"
    }]
};

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<MemberProfileDto | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        userService.getProfile()
            .then(response => {
                setProfile(response.data);
            })
            .catch(() => {
                console.log('API 요청 실패, 더미 데이터 사용');
                setProfile(dummyProfile);
            });
    }, []);

    if (!profile) {
        return <div className="max-w-2xl mx-auto mt-10 p-8">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-[#141414] pt-20">
            <div className="container mx-auto px-4">
                {/* 상단 프로필 영역 */}
                <div className="flex items-center bg-[#181818] p-8 rounded-lg mb-8 gap-8">
                    {/* 프로필 아이콘 */}
                    <div className="w-20 h-20 rounded-full bg-green-600 flex items-center justify-center text-4xl font-bold text-white shadow-lg">
                        {profile.username[0].toUpperCase()}
                    </div>
                    {/* 유저 정보 */}
                    <div className="flex-1">
                        <div className="text-white text-2xl font-bold mb-1">{profile.username}</div>
                        <div className="text-gray-400 text-base">구독 상태: {profile.isSubscribed === true ? '구독중' : '미구독'}</div>
                    </div>
                    {/* 구독 관리 버튼 */}
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
                        onClick={() => navigate('/subscription')}
                    >
                        구독 관리
                    </button>
                </div>
                {/* 좋아요한 콘텐츠 */}
                {profile.liked && profile.liked.length > 0 && (
                    <SectionSlider
                        title="찜한 콘텐츠"
                        videos={profile.liked}
                        showRank={false}
                        onCardClick={(video) => navigate(`/watch/${video.videoId}`)}
                    />
                )}
            </div>
        </div>
    );
};

export default ProfilePage;