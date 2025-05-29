import React, {useEffect, useState} from "react";   
import { subscriptionService } from "../api/services/SubscriptionService";
import { Subscription } from "../types/Subscription";

const dummySubscription: Subscription = {
    status: 'ACTIVE',
    billingHistory: [
        { date: '2024-03-01', amount: 9900 },
        { date: '2024-02-01', amount: 9900 },
        { date: '2024-01-01', amount: 9900 }
    ]
};

const SubscriptionPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        subscriptionService.getSubscription()
            .then(response => setSubscription(response.data))
            .catch(() => {
                setError('구독 정보를 불러오는데 실패했습니다.');
                setSubscription(dummySubscription);
            });
    }, []);

    // if (error) {
    //     return (
    //         <div className="max-w-2xl mx-auto mt-10 p-8 bg-red-100 rounded shadow">
    //             <p className="text-red-600">{error}</p>
    //             <p className="text-gray-600 mt-2">임시 구독 정보가 표시됩니다.</p>
    //         </div>
    //     );
    // }

    if (!subscription) {
        return <div className="max-w-2xl mx-auto mt-10 p-8">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-[#141414] pt-20">
            <div className="container mx-auto px-4">
                <div className="bg-[#181818] p-8 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4 text-white">구독 관리</h2>
                    <div className="text-gray-300 mb-4">상태: {subscription.status}</div>
                    <div className="text-gray-300 mb-4">결제 내역:</div>
                    <ul className="mb-6">
                        {subscription.billingHistory.map((b, i) => (
                            <li key={i} className="text-gray-300">
                                {b.date} - {b.amount.toLocaleString()}원
                            </li>
                        ))}
                    </ul>
                    <div className="flex gap-4">
                        <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                            구독 업그레이드
                        </button>
                        <button className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700">
                            구독 취소
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPage;