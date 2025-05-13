import React, {useEffect, useState} from "react";
import { userService } from "../api/services/UserService";
import { User, Video } from "../api/types";
import { UserProfile } from "../api/types";
import SectionSlider from "./SectionSlider";
import { useNavigate } from "react-router-dom";

const dummyProfile: UserProfile = {
    username: 'default',
    subscription: 'SUBSCRIBED',
    liked: [{
        "id": "1",
        "thumbnail": "https://www.youtube.com/embed/YoHD9XEInc0",
        "title": "인셉션",
        "videoId": "YoHD9XEInc0",
    }]
};

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // API 요청 시도
        userService.getProfile()
            .then(response => {
                const { username, subscription, liked } = response.data;
                setUser({ username, subscription, liked });
            })
            .catch(() => {
                // API 요청 실패 시 더미 데이터 사용
                console.log('API 요청 실패, 더미 데이터 사용');
                setUser(dummyProfile);
            });
    }, []);

    // if (error) {
    //     return (
    //         <div className="max-w-2xl mx-auto mt-10 p-8 bg-red-100 rounded shadow">
    //             <p className="text-red-600">{error}</p>
    //             <p className="text-gray-600 mt-2">임시 프로필이 표시됩니다.</p>
    //         </div>
    //     );
    // }

    if (!user) {
        return <div className="max-w-2xl mx-auto mt-10 p-8">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-[#141414] pt-20">
            <div className="container mx-auto px-4">
                {/* 상단 프로필 영역 */}
                <div className="flex items-center bg-[#181818] p-8 rounded-lg mb-8 gap-8">
                    {/* 프로필 아이콘 */}
                    <div className="w-20 h-20 rounded-full bg-green-600 flex items-center justify-center text-4xl font-bold text-white shadow-lg">
                        {user.username[0].toUpperCase()}
                    </div>
                    {/* 유저 정보 */}
                    <div className="flex-1">
                        <div className="text-white text-2xl font-bold mb-1">{user.username}</div>
                        <div className="text-gray-400 text-base">구독 상태: {user.subscription === 'SUBSCRIBED' ? '구독중' : '미구독'}</div>
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
                <SectionSlider
                    title="찜한 콘텐츠"
                    videos={user.liked}
                    showRank={false}
                    onCardClick={(video) => navigate(`/watch/${video.videoId}`)}
                />
            </div>
        </div>
    );
};

export default ProfilePage;