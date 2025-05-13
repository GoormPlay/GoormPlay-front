import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../api/services/UserService';
import { User } from '../api/types';

const NavBar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      userService.getProfile()
        .then(response => setUser(response.data))
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="w-full h-16 flex items-center justify-between px-8 bg-black/95 fixed top-0 left-0 z-50">
      {/* 왼쪽: 로고 + 메뉴 */}
      <div className="flex items-center gap-8">
        <img src="/logo-coupangplay.png" alt="logo" className="h-8" />
        <ul className="flex gap-6 text-white font-bold text-base">
          <li className="cursor-pointer hover:text-blue-400">TV</li>
          <li className="cursor-pointer hover:text-blue-400">영화</li>
          <li className="cursor-pointer hover:text-blue-400">스포츠</li>
          <li className="cursor-pointer hover:text-blue-400">스토어</li>
          <li className="cursor-pointer hover:text-blue-400">키즈</li>
          <li className="cursor-pointer hover:text-blue-400">라이브</li>
        </ul>
      </div>
      {/* 오른쪽: 검색창 + 프로필 */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="제목, 장르, 배우로 찾아보세요"
            className="rounded bg-[#222] text-white px-4 py-2 pl-10 w-40 md:w-64 lg:w-80 outline-none"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
        {!isLoading && (
          user ? (
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 text-white hover:text-blue-400"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                  {user.username[0].toUpperCase()}
                </div>
                <span>{user.username}</span>
              </button>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-white"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              로그인
            </button>
          )
        )}
      </div>
    </nav>
  );
};

export default NavBar;