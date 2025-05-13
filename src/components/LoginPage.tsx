import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../api/services/UserService';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [remember, setRemember] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await userService.login(username, password);
      if (response.data.token) {
        // 토큰 저장
        localStorage.setItem('token', response.data.token);
        // 홈으로 이동
        navigate('/');
      }
    } catch (err) {
      setError('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#141414]">
      <div className="bg-[#181818] p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-white">로그인</h2>
        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2" htmlFor="username">
              아이디
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded bg-[#222] text-white border border-[#333] focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 mb-2" htmlFor="password">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded bg-[#222] text-white border border-[#333] focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
          <div className="mb-6">
            <label className="flex items-center text-gray-300">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="mr-2"
              />
              로그인 상태 유지
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 transition"
          >
            로그인
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/signup')}
            className="text-blue-500 hover:text-blue-400"
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;