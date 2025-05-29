import React, { useState, useEffect } from 'react';
import { MemberProfileDto, ApiResponse } from '../api/types';
import { userService } from '../api/services/UserService';
import SectionSlider from "./SectionSlider";
import { useNavigate } from "react-router-dom";

const dummyProfile: MemberProfileDto = {
    username: 'default',
    gender: 'MALE',
    age: 20,
    subscription_start_date: undefined,
    subscription_end_date: undefined,
    isCancelScheduled: false,
    isSubscribed: false,
    liked: []
};

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<MemberProfileDto | null>(null);

    useEffect(() => {
        userService.getProfile()
            .then((response: ApiResponse<{ data: MemberProfileDto }>) => {
                console.log('프로필 응답:', response.data); // 디버깅용 로그
                if (response.data.data && response.data.data.liked) {
                    console.log('liked 배열:', response.data.data.liked); // 디버깅용 로그
                }
                setProfile(response.data.data);
            })
            .catch(() => {
                console.log('API 요청 실패, 더미 데이터 사용');
                setProfile(dummyProfile);
            });
    }, []);

    if (!profile) {
        return <div className="max-w-2xl mx-auto mt-10 p-8">Loading...</div>;
    }

    const hasLikedContent = profile.liked && Array.isArray(profile.liked) && profile.liked.length > 0;
    console.log('hasLikedContent:', hasLikedContent); // 디버깅용 로그

    return (
        <div className="min-h-screen bg-[#141414] pt-20">
            <div className="container mx-auto px-4">
                {/* 상단 프로필 영역 */}
                <div className="flex items-center bg-[#181818] p-8 rounded-lg mb-8 gap-8">
                    {/* 프로필 아이콘 */}
                    <div className="w-20 h-20 rounded-full bg-green-600 flex items-center justify-center text-4xl font-bold text-white shadow-lg">
                        {profile.username}
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
                {hasLikedContent && profile.liked ? (
                    <SectionSlider
                        title="찜한 콘텐츠"
                        videos={profile.liked}
                        showRank={false}
                        onCardClick={(video) => navigate(`/watch/${video.videoId}`)}
                    />
                ) : (
                    <div className="bg-[#181818] p-8 rounded-lg text-center">
                        <div className="text-white text-2xl font-bold mb-4">찜한 콘텐츠가 없습니다</div>
                        <p className="text-gray-400 mb-6">마음에 드는 콘텐츠를 찜하면 여기에 표시됩니다.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
                        >
                            콘텐츠 둘러보기
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;