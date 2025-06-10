import React, { useState, useEffect } from 'react';
import { adAdminService } from '../api/services/AdAdminService';
import { AdvertiserAccountDTO } from '../api/types';

const AdBudgetPage: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [account, setAccount] = useState<AdvertiserAccountDTO | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 잔액 조회
  const fetchBalance = async () => {
    try {
      const response = await adAdminService.getAdBalance();
      setAccount(response);
      setError(null);
    } catch (err) {
      setError('잔액 조회에 실패했습니다.');
      console.error('Error fetching balance:', err);
    }
  };

  // 컴포넌트 마운트 시 잔액 조회
  useEffect(() => {
    const fetchBalance = async () => {
      setIsLoading(true); // 🔹 로딩 시작
      try {
        const response = await adAdminService.getAdBalance();
        setAccount(response);
        setError(null);
      } catch (err) {
        setError('잔액 조회에 실패했습니다.');
        console.error('Error fetching balance:', err);
      } finally {
        setIsLoading(false); // 🔹 로딩 끝
      }
    };
    fetchBalance();
  }, []);

  const handleRecharge = async () => {
    const num = Number(amount);
    if (isNaN(num) || num <= 0) {
      setError('유효한 금액을 입력해주세요.');
      return;
    }

    try {
      await adAdminService.rechargeAd(num);
      await fetchBalance(); // 잔액 조회를 다시 수행
      setAmount('');
      setError(null);
    } catch (err) {
      setError('충전에 실패했습니다.');
      console.error('Error recharging:', err);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-8">광고비</h2>
      <div className="bg-[#181818] rounded-lg p-8 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <span className="text-white text-lg font-semibold">충전하기</span>
          <input
            type="text"
            placeholder="금액을 입력하세요"
            value={amount}
            onChange={e => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
            className="bg-[#232323] text-white px-4 py-2 rounded focus:outline-none w-48"
            disabled={isLoading}
          />
          <button
            className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-bold ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={handleRecharge}
            disabled={isLoading}
          >
            {isLoading ? '처리중...' : '입력'}
          </button>
        </div>
        
        {error && (
          <div className="text-red-500 mb-4">
            {error}
          </div>
        )}

        <div className="bg-[#232323] rounded-lg p-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-300 text-xl">현재 잔액</span>
            <span className="text-2xl font-bold text-white">
              {account?.currentBalance.toLocaleString() ?? 0} 원
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-xl">총 충전액</span>
            <span className="text-2xl font-bold text-white">
              {account?.totalBudget.toLocaleString() ?? 0} 원
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdBudgetPage; 