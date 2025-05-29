import React, { useEffect, useState } from "react";
import { adService } from "../api/services/AdService";
import { useNavigate } from "react-router-dom";
import { Ad } from "../api/types";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';

const dummyAds: Ad[] = [
    {
        id: "1",
        adSnId: "AD001",
        type: "A",
        title: "신규 가입자 프로모션",
        thumbnailUrl: "https://example.com/thumb1.jpg",
        link: "https://example.com/promo1",
        impressions: 8000,
        clicks: 4000,
        cpc: 400,
        balance: 400000,
    },
    {
        id: "2",
        adSnId: "AD001",
        type: "B",
        title: "신규 가입자 프로모션",
        thumbnailUrl: "https://example.com/thumb2.jpg",
        link: "https://example.com/promo2",
        impressions: 5000,
        clicks: 1823,
        cpc: 450,
        balance: 365000,
    },
    {
        id: "3",
        adSnId: "AD002",
        type: "A",
        title: "시즌 할인 이벤트",
        thumbnailUrl: "https://example.com/thumb3.jpg",
        link: "https://example.com/promo3",
        impressions: 10000,
        clicks: 3000,
        cpc: 350,
        balance: 500000,
    }
];

const TYPE_OPTIONS = ["전체", "A", "B"];

function getAdStats(ads: Ad[], type: '전체' | 'A' | 'B') {
    if (type === "전체") {
        // 합산
        return ads.reduce((acc, ad) => ({
            impressions: acc.impressions + (ad.impressions || 0),
            clicks: acc.clicks + (ad.clicks || 0),
            cpc: acc.cpc + (ad.cpc || 0),
            balance: acc.balance + (ad.balance || 0),
        }), { impressions: 0, clicks: 0, cpc: 0, balance: 0 });
    } else {
        const ad = ads.find(ad => ad.type === type);
        return ad ? {
            impressions: ad.impressions,
            clicks: ad.clicks,
            cpc: ad.cpc,
            balance: ad.balance,
        } : { impressions: 0, clicks: 0, cpc: 0, balance: 0 };
    }
}

interface AdStatusCardProps {
    stats: { impressions: number; clicks: number; cpc: number; balance: number };
    adOn: boolean;
    setAdOn: (on: boolean) => void;
    selectedType: '전체' | 'A' | 'B';
    setSelectedType: (type: '전체' | 'A' | 'B') => void;
    typeAvailable: string[];
}

const AdStatusCard: React.FC<AdStatusCardProps> = ({ stats, adOn, setAdOn, selectedType, setSelectedType, typeAvailable }) => (
    <div className="bg-[#181818] rounded-lg p-8 mb-8">
        <div className="flex items-center gap-6 mb-8">
            <span className="text-white text-lg font-semibold">광고상태</span>
            <button
                className={`w-16 h-8 rounded-full flex items-center transition-colors duration-300 ${adOn ? 'bg-blue-600' : 'bg-gray-500'}`}
                onClick={() => setAdOn(!adOn)}
            >
                <span
                    className={`w-7 h-7 bg-white rounded-full shadow transform transition-transform duration-300 ${adOn ? 'translate-x-8' : 'translate-x-1'}`}
                />
            </button>
            <span className={`ml-2 text-sm font-bold ${adOn ? 'text-blue-400' : 'text-gray-400'}`}>{adOn ? 'ON' : 'OFF'}</span>
            <div className="ml-auto flex gap-2">
                {TYPE_OPTIONS.filter(t => t === '전체' || typeAvailable.includes(t)).map(type => (
                    <button
                        key={type}
                        className={`px-4 py-2 rounded font-bold text-sm transition ${selectedType === type ? 'bg-blue-600 text-white' : 'bg-[#232323] text-gray-300 hover:bg-blue-700'}`}
                        onClick={() => setSelectedType(type as 'A' | 'B' | '전체')}
                    >
                        {type}
                    </button>
                ))}
            </div>
        </div>
        <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-[#232323] rounded-lg p-6 flex flex-col items-center">
                <span className="text-gray-400 text-lg mb-2">노출수</span>
                <span className="text-2xl font-bold text-white">{stats.impressions.toLocaleString()}</span>
            </div>
            <div className="bg-[#232323] rounded-lg p-6 flex flex-col items-center">
                <span className="text-gray-400 text-lg mb-2">클릭수</span>
                <span className="text-2xl font-bold text-white">{stats.clicks.toLocaleString()}</span>
            </div>
            <div className="bg-[#232323] rounded-lg p-6 flex flex-col items-center">
                <span className="text-gray-400 text-lg mb-2">CPC</span>
                <span className="text-2xl font-bold text-white">{stats.cpc}원/click</span>
            </div>
        </div>
        <div className="flex justify-center mt-4">
            <span className="text-xl text-gray-300 mr-2">광고잔액</span>
            <span className="text-2xl font-bold text-white">₩ {stats.balance.toLocaleString()}</span>
        </div>
    </div>
);

interface AdCompareChartProps {
    ads: Ad[];
}

const AdCompareChart: React.FC<AdCompareChartProps> = ({ ads }) => {
    // A, B 타입만 비교
    const data = ["A", "B"].map(type => {
        const ad = ads.find(ad => ad.type === type);
        return {
            type,
            노출수: ad ? ad.impressions : 0,
            클릭수: ad ? ad.clicks : 0,
            CPC: ad ? ad.cpc : 0,
        };
    });
    return (
        <div className="bg-[#181818] rounded-lg p-8 mb-8">
            <h3 className="text-white text-lg font-bold mb-4">A/B 타입 비교</h3>
            <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <XAxis dataKey="type" stroke="#ccc" />
                    <YAxis stroke="#ccc" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="노출수" fill="#8884d8">
                        <LabelList dataKey="노출수" position="top" />
                    </Bar>
                    <Bar dataKey="클릭수" fill="#82ca9d">
                        <LabelList dataKey="클릭수" position="top" />
                    </Bar>
                    <Bar dataKey="CPC" fill="#ffc658">
                        <LabelList dataKey="CPC" position="top" />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

const AdManagementPage: React.FC = () => {
    const [ads, setAds] = useState<Ad[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [adOn, setAdOn] = useState(true);
    const [selectedAdSnId, setSelectedAdSnId] = useState<string>('AD001');
    const [selectedType, setSelectedType] = useState<'전체'|'A'|'B'>('전체');
    const navigate = useNavigate();

    useEffect(() => {
        adService.getAds()
            .then(response => setAds(response.data))
            .catch(() => {
                setAds(dummyAds);
            });
    }, []);

    // 선택된 adSnId의 광고들
    const filteredAds = ads.filter(ad => ad.adSnId === selectedAdSnId);
    // 타입 존재 여부
    const typeAvailable = filteredAds.map(ad => ad.type);
    // 카드에 표시할 데이터
    const stats = getAdStats(filteredAds, selectedType);

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8">광고관리</h2>
            <AdStatusCard
                stats={stats}
                adOn={adOn}
                setAdOn={setAdOn}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                typeAvailable={typeAvailable}
            />
            <AdCompareChart ads={filteredAds} />
            <div className="bg-[#181818] p-8 rounded-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">광고 관리</h2>
                <button 
                onClick={() => navigate('/ad-create')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    광고 등록
                </button>
                <div className="overflow-x-auto">
                    <table className="w-full text-white">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="text-left p-4">유형</th>
                                <th className="text-left p-4">광고 ID</th>
                                <th className="text-left p-4">타입</th>
                                <th className="text-left p-4">제목</th>
                                <th className="text-left p-4">썸네일</th>
                                <th className="text-left p-4">링크</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ads.map(ad => (
                                <tr
                                    key={ad.id}
                                    className={`border-b border-gray-700 cursor-pointer transition hover:bg-[#232323] ${ad.adSnId === selectedAdSnId ? 'bg-[#232323]' : ''}`}
                                    onClick={() => {
                                        setSelectedAdSnId(ad.adSnId);
                                        setSelectedType('전체');
                                    }}
                                >
                                    <td className="p-4">{ad.adSnId}</td>
                                    <td className="p-4">{ad.id}</td>
                                    <td className="p-4">{ad.type}</td>
                                    <td className="p-4">{ad.title}</td>
                                    <td className="p-4">
                                        <img 
                                            src={ad.thumbnailUrl} 
                                            alt={ad.title}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                    </td>
                                    <td className="p-4">
                                        <a 
                                            href={ad.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:text-blue-300"
                                        >
                                            링크
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdManagementPage;