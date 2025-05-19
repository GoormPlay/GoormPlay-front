import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const menus = [
  { name: '광고관리', path: '/ad-management' },
  { name: '광고비', path: '/ad-budget' },
  { name: '배너 컨텐츠', path: '/banner-content' },
  { name: '광고 등록', path: '/ad-create' },
];

const AdSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <aside className="w-56 bg-[#181818] text-white flex flex-col pt-24 min-h-screen shadow-lg">
      <div className="flex flex-col items-center mb-10">
        <div className="w-16 h-16 rounded-full bg-gray-600 flex items-center justify-center text-3xl mb-2">
          <span role="img" aria-label="profile">👤</span>
        </div>
      </div>
      <nav className="flex-1">
        {menus.map(menu => (
          <div
            key={menu.path}
            className={`px-8 py-4 cursor-pointer text-lg font-semibold transition-colors 
              ${location.pathname === menu.path ? 'bg-[#232323] text-yellow-400' : 'hover:bg-[#232323] hover:text-yellow-300'}`}
            onClick={() => navigate(menu.path)}
          >
            {menu.name}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default AdSidebar; 