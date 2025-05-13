import React, { useState } from 'react';

const AdBudgetPage: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(1000000); // 더미 잔액

  const handleCharge = () => {
    const num = parseInt(amount.replace(/[^0-9]/g, ''));
    if (!isNaN(num) && num > 0) {
      setBalance(balance + num);
      setAmount('');
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
          />
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-bold"
            onClick={handleCharge}
          >
            입력
          </button>
        </div>
        <div className="bg-[#232323] rounded-lg p-8 flex items-center justify-between">
          <span className="text-gray-300 text-xl">잔액</span>
          <span className="text-2xl font-bold text-white">{balance.toLocaleString()} 원</span>
        </div>
      </div>
    </div>
  );
};

export default AdBudgetPage; 