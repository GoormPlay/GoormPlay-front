import React, { useRef, useState } from 'react';

interface Banner {
  type: string;
  url: string;
}

const initialBanners: Banner[] = [
  { type: 'A-Type', url: 'https://via.placeholder.com/320x100?text=Banner+A' },
  { type: 'B-Type', url: 'https://via.placeholder.com/320x100?text=Banner+B' },
];

const BannerContentPage: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState('A-Type');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = () => {
    if (file) {
      const url = URL.createObjectURL(file);
      setBanners([...banners, { type, url }]);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-8">배너 컨텐츠</h2>
      <div className="bg-[#181818] rounded-lg p-8 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <span className="text-white text-lg font-semibold">파일</span>
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            className="bg-[#232323] text-white px-4 py-2 rounded focus:outline-none"
          >
            <option value="A-Type">A-Type</option>
            <option value="B-Type">B-Type</option>
          </select>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={e => setFile(e.target.files?.[0] || null)}
            className="bg-[#232323] text-white px-4 py-2 rounded focus:outline-none"
          />
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-bold"
            onClick={handleUpload}
            disabled={!file}
          >
            업로드
          </button>
        </div>
        <div className="space-y-6">
          {banners.map((banner, idx) => (
            <div key={idx} className="flex items-center bg-[#232323] rounded-lg p-4 gap-6">
              <span className="text-white text-lg font-bold w-24">{banner.type}</span>
              <img src={banner.url} alt={banner.type} className="h-20 rounded shadow" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannerContentPage; 