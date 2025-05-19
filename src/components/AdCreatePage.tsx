import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adService } from '../api/services/AdService';
import imageCompression from 'browser-image-compression';

interface AdFormData {
    title: string;
    budget: number;
    embedUrlA: string;
    embedUrlB: string;
    thumbnailA: File | null;
    thumbnailB: File | null;
}

const AdCreatePage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<AdFormData>({
      title: '',
      budget: 0,
      embedUrlA: '',
      embedUrlB: '',
      thumbnailA: null,
      thumbnailB: null,
    });
  
    const [previewA, setPreviewA] = useState<string>('');
    const [previewB, setPreviewB] = useState<string>('');
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: name === 'budget' ? Number(value) : value
      }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'A' | 'B') => {
      const file = e.target.files?.[0];
      if (!file) return;

      // 이미지 파일인지 확인
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        e.target.value = '';
        return;
      }

      try {
        // 이미지 압축 옵션 설정
        const options = {
          maxSizeMB: 1, // 최대 1MB
          maxWidthOrHeight: 1920, // 최대 너비/높이
          useWebWorker: true, // 웹 워커 사용으로 성능 향상
        };

        // 이미지 압축
        const compressedFile = await imageCompression(file, options);
        
        // 압축된 파일로 상태 업데이트
        setFormData(prev => ({
          ...prev,
          [`thumbnail${type}`]: compressedFile
        }));

        // 미리보기 생성
        const reader = new FileReader();
        reader.onloadend = () => {
          if (type === 'A') {
            setPreviewA(reader.result as string);
          } else {
            setPreviewB(reader.result as string);
          }
        };
        reader.readAsDataURL(compressedFile);

      } catch (error) {
        console.error('이미지 압축 중 오류 발생:', error);
        alert('이미지 처리 중 오류가 발생했습니다.');
        e.target.value = '';
      }
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!formData.thumbnailA || !formData.thumbnailB) {
        alert('썸네일 이미지를 모두 업로드해주세요.');
        return;
      }

      try {
        // FormData 객체 생성 및 데이터 추가
        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('budget', formData.budget.toString());
        formDataToSend.append('embedUrlA', formData.embedUrlA);
        formDataToSend.append('embedUrlB', formData.embedUrlB);
        
        // null이 아닌 경우에만 추가
        if (formData.thumbnailA) {
          formDataToSend.append('thumbnailA', formData.thumbnailA);
        }
        if (formData.thumbnailB) {
          formDataToSend.append('thumbnailB', formData.thumbnailB);
        }

        // FormData 객체를 직접 전달
        await adService.createAd(formDataToSend);
        navigate('/ad-management');
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('광고 등록에 실패했습니다. 다시 시도해주세요.');
      }
    };
  
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">새 광고 등록</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-[#232323] p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">공통 정보</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">광고 제목</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-[#141414] rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">예산 (원)</label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-[#141414] rounded-lg"
                  required
                />
              </div>
            </div>
          </div>
  
          <div className="grid grid-cols-2 gap-6">
            {/* A 타입 광고 */}
            <div className="bg-[#232323] p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">A 타입 광고</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">임베드 URL</label>
                  <input
                    type="url"
                    name="embedUrlA"
                    value={formData.embedUrlA}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-[#141414] rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">썸네일 이미지</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'A')}
                    className="w-full px-4 py-2 bg-[#141414] rounded-lg"
                    required
                  />
                  {previewA && (
                    <div className="mt-2">
                      <img src={previewA} alt="Preview A" className="max-w-full h-auto rounded-lg" />
                    </div>
                  )}
                </div>
              </div>
            </div>
  
            {/* B 타입 광고 */}
            <div className="bg-[#232323] p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">B 타입 광고</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">임베드 URL</label>
                  <input
                    type="url"
                    name="embedUrlB"
                    value={formData.embedUrlB}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-[#141414] rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">썸네일 이미지</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'B')}
                    className="w-full px-4 py-2 bg-[#141414] rounded-lg"
                    required
                  />
                  {previewB && (
                    <div className="mt-2">
                      <img src={previewB} alt="Preview B" className="max-w-full h-auto rounded-lg" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
  
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/ad-management')}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              광고 등록
            </button>
          </div>
        </form>
      </div>
    );
}
export default AdCreatePage; 