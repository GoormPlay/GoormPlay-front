import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../api/services/UserService';
import { SignUpRequestDto } from '../api/types';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignUpRequestDto>({
    username: '',
    password: '',
    gender: 'MALE',
    age: 0
  });
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (formData.age < 1) {
      setError('나이는 1 이상이어야 합니다.');
      return;
    }

    try {
      await userService.signUp(formData);
      navigate('/login');
    } catch (err) {
      setError('회원가입에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) || 0 : value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#141414]">
      <div className="bg-[#181818] p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-white">회원가입</h2>
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
          <div className="mb-4">
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
          <div className="mb-4">
            <label className="block text-gray-300 mb-2" htmlFor="confirmPassword">
              비밀번호 확인
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 rounded bg-[#222] text-white border border-[#333] focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2" htmlFor="gender">
              성별
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-3 rounded bg-[#222] text-white border border-[#333] focus:border-blue-500 focus:outline-none"
              required
            >
              <option value="MALE">남성</option>
              <option value="FEMALE">여성</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 mb-2" htmlFor="age">
              나이
            </label>
            <input
              id="age"
              name="age"
              type="number"
              min="1"
              value={formData.age}
              onChange={handleChange}
              className="w-full p-3 rounded bg-[#222] text-white border border-[#333] focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 transition"
          >
            회원가입
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-blue-500 hover:text-blue-400"
          >
            로그인으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage; 