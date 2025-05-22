import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../api/services/UserService';
import { SignInRequestDto } from '../api/types';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignInRequestDto>({
    username: '',
    password: ''
  });
  const [remember, setRemember] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await userService.signIn(formData);
      if (response.data.data) {
        if (remember) {
          localStorage.setItem('rememberMe', 'true');
        }
        navigate('/');
      }
    } catch (err) {
      setError('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
    }
  };

  const handleTestLogin = async (username: string, password: string) => {
    try {
      const response = await userService.signIn({ username, password });
      if (response.data.data) {
        navigate('/');
      }
    } catch (err) {
      setError('로그인에 실패했습니다.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
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
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
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
            className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 transition mb-4"
          >
            로그인
          </button>
        </form>
        <div className="space-y-3">
          <button
            onClick={() => handleTestLogin('test', '1234')}
            className="w-full bg-gray-600 text-white py-3 rounded font-bold hover:bg-gray-700 transition"
          >
            테스트 계정으로 로그인 (test/1234)
          </button>
          <button
            onClick={() => handleTestLogin('admin', '1234')}
            className="w-full bg-gray-600 text-white py-3 rounded font-bold hover:bg-gray-700 transition"
          >
            관리자 계정으로 로그인 (admin/1234)
          </button>
        </div>
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