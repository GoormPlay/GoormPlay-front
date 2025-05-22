import { ApiClient } from '../ApiClient';
import { VideoEvent } from '../../types/video';
import { Video } from '../types';
import { API_ENDPOINTS } from '../types';

// dummyVideos를 Video 타입으로 선언
const dummyVideos: Video[] = [
  {
    id: "681c4f881c23f65a639fde17",
    title: "기생충",
    kind: "MOVIE",
    genre: ["드라마", "스릴러"],
    thumbnail: "",
    videoId: "5xH0HfJHsaY",
    synopsis: "가난한 가족이 부잣집에 얽히며 벌어지는 블랙코미디 스릴러."
  },
  {
    id: "681c4f881c23f65a639fde18",
    title: "올드보이",
    kind: "MOVIE",
    genre: ["액션", "드라마", "미스터리"],
    thumbnail: "",
    videoId: "2HkjrJ6IK5E",
    synopsis: "15년간 감금된 남자의 복수극을 그린 미스터리 액션."
  },
  {
    id: "681c4f881c23f65a639fde19",
    title: "라라랜드",
    kind: "MOVIE",
    genre: ["뮤지컬", "로맨스"],
    thumbnail: "",
    videoId: "0pdqf4P9MB8",
    synopsis: "꿈을 좇는 두 남녀의 사랑과 이별을 그린 뮤지컬 영화."
  },
  {
    id: "681c4f881c23f65a639fde20",
    title: "인터스텔라",
    kind: "MOVIE",
    genre: ["SF", "드라마"],
    thumbnail: "",
    videoId: "zSWdZVtXT7E",
    synopsis: "인류의 미래를 위해 우주로 떠나는 아버지와 딸의 이야기."
  },
  {
    "id": "681c4f881c23f65a639fde21",
    "title": "어벤져스: 엔드게임",
    "kind": "MOVIE",
    "genre": ["액션", "SF"],
    "thumbnail": "",
    "videoId": "TcMBFSGVi1c",
    "synopsis": "우주를 위협하는 타노스에 맞서 어벤져스가 마지막 전투를 벌이는 이야기."
  },
  {
    "id": "681c4f881c23f65a639fde22",
    "title": "조커",
    "kind": "MOVIE",
    "genre": ["드라마", "스릴러"],
    "thumbnail": "",
    "videoId": "zAGVQLHvwOY",
    "synopsis": "고담시의 외로운 남자가 조커로 변해가는 과정을 그린 심리 스릴러."
  },
  {
    "id": "681c4f881c23f65a639fde23",
    "title": "기묘한 이야기",
    "kind": "TV",
    "genre": ["SF", "스릴러"],
    "thumbnail": "",
    "videoId": "b9EkMc79ZSU",
    "synopsis": "작은 마을에서 소년의 실종과 함께 벌어지는 초자연적 사건들."
  },
  {
    "id": "681c4f881c23f65a639fde24",
    "title": "더 배트맨",
    "kind": "MOVIE",
    "genre": ["액션", "범죄"],
    "thumbnail": "",
    "videoId": "mqqft2x_Aa4",
    "synopsis": "고담시의 범죄와 싸우는 젊은 배트맨의 이야기."
  },
  {
    "id": "681c4f881c23f65a639fde25",
    "title": "듄",
    "kind": "MOVIE",
    "genre": ["SF", "드라마"],
    "thumbnail": "",
    "videoId": "n9xhJrPXop4",
    "synopsis": "사막 행성 아라키스를 둘러싼 권력과 운명의 대서사시."
  },
  {
    "id": "681c4f881c23f65a639fde26",
    "title": "소울",
    "kind": "MOVIE",
    "genre": ["애니메이션", "드라마"],
    "thumbnail": "",
    "videoId": "xOsLIiBStEs",
    "synopsis": "재즈 음악가가 영혼의 세계에서 삶의 의미를 찾아가는 이야기."
  },
  {
    "id": "681c4f881c23f65a639fde27",
    "title": "원더 우먼 1984",
    "kind": "MOVIE",
    "genre": ["액션", "판타지"],
    "thumbnail": "",
    "videoId": "sfM7_JLk-84",
    "synopsis": "1980년대를 배경으로 한 원더 우먼의 새로운 모험."
  },
  {
    "id": "681c4f881c23f65a639fde28",
    "title": "테넷",
    "kind": "MOVIE",
    "genre": ["액션", "SF"],
    "thumbnail": "",
    "videoId": "L3pk_TBkihU",
    "synopsis": "시간의 흐름을 역행하는 작전을 수행하는 요원의 이야기."
  },
  {
    "id": "681c4f881c23f65a639fde29",
    "title": "노매드랜드",
    "kind": "MOVIE",
    "genre": ["드라마"],
    "thumbnail": "",
    "videoId": "6sxCFZ8_d84",
    "synopsis": "현대 미국을 떠도는 여성의 삶을 그린 로드무비."
  },
  {
    "id": "681c4f881c23f65a639fde30",
    "title": "더 수어사이드 스쿼드",
    "kind": "MOVIE",
    "genre": ["액션", "코미디"],
    "thumbnail": "",
    "videoId": "Z1EbSXxrZ34",
    "synopsis": "최악의 슈퍼빌런들이 모여 미션을 수행하는 이야기."
  },
  {
    "id": "681c4f881c23f65a639fde31",
    "title": "인사이드 아웃",
    "kind": "MOVIE",
    "genre": ["애니메이션", "가족"],
    "thumbnail": "",
    "videoId": "seMwpP0yeu4",
    "synopsis": "소녀의 감정들이 의인화되어 펼쳐지는 내면의 세계."
  },
  {
    "id": "681c4f881c23f65a639fde32",
    "title": "라야와 마지막 드래곤",
    "kind": "MOVIE",
    "genre": ["애니메이션", "판타지"],
    "thumbnail": "",
    "videoId": "1VIZ89FEjYI",
    "synopsis": "전설의 드래곤을 찾아 평화를 되찾으려는 전사의 여정."
  },
  {
    "id": "681c4f881c23f65a639fde33",
    "title": "루카",
    "kind": "MOVIE",
    "genre": ["애니메이션", "가족"],
    "thumbnail": "",
    "videoId": "mYfJxlgR2jw",
    "synopsis": "이탈리아 해변 마을에서 펼쳐지는 소년의 여름 이야기."
  },
  {
    "id": "681c4f881c23f65a639fde34",
    "title": "크루엘라",
    "kind": "MOVIE",
    "genre": ["범죄", "드라마"],
    "thumbnail": "",
    "videoId": "gmRKv7n2If8",
    "synopsis": "디즈니 악당 크루엘라의 젊은 시절을 그린 영화."
  },
  {
    "id": "681c4f881c23f65a639fde35",
    "title": "샹치와 텐 링즈의 전설",
    "kind": "MOVIE",
    "genre": ["액션", "판타지"],
    "thumbnail": "",
    "videoId": "8YjFbMbfXaQ",
    "synopsis": "숨겨진 과거를 가진 무술 고수가 운명에 맞서는 이야기."
  },
  {
    "id": "681c4f881c23f65a639fde36",
    "title": "이터널스",
    "kind": "MOVIE",
    "genre": ["액션", "SF"],
    "thumbnail": "",
    "videoId": "x_me3xsvDgk",
    "synopsis": "수천 년을 살아온 초인들이 지구를 지키기 위해 다시 모인다."
  },
  {
    "id": "681c4f881c23f65a639fde37",
    "title": "킹스맨: 퍼스트 에이전트",
    "kind": "MOVIE",
    "genre": ["액션", "스릴러"],
    "thumbnail": "",
    "videoId": "0pbLPOrTSsI",
    "synopsis": "킹스맨 조직의 기원을 다룬 스파이 액션 영화."
  },
  {
    "id": "681c4f881c23f65a639fde38",
    "title": "스파이더맨: 노 웨이 홈",
    "kind": "MOVIE",
    "genre": ["액션", "SF"],
    "thumbnail": "",
    "videoId": "JfVOs4VSpmA",
    "synopsis": "정체가 드러난 스파이더맨이 멀티버스의 위협에 맞서는 이야기."
  },
  {
    "id": "681c4f881c23f65a639fde39",
    "title": "더 프렌치 디스패치",
    "kind": "MOVIE",
    "genre": ["코미디", "드라마"],
    "thumbnail": "",
    "videoId": "TcPk2p0Zaw4",
    "synopsis": "프랑스 가상의 도시에서 발행되는 잡지의 이야기를 옴니버스 형식으로 그린 영화."
  },
  {
    "id": "681c4f881c23f65a639fde40",
    "title": "하우스 오브 구찌",
    "kind": "MOVIE",
    "genre": ["드라마", "범죄"],
    "thumbnail": "",
    "videoId": "eGNnpVKxV6s",
    "synopsis": "구찌 가문의 스캔들과 배신, 그리고 살인을 다룬 실화 기반 영화."
  }
];

class VideoService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async getVideos(): Promise<Video[]> {
    try {
      const response = await this.apiClient.get<Video[]>('VIDEOS');
      return response.data;
    } catch (error) {
      console.error('Error fetching videos:', error);
      throw error;
    }
  }

  async getLatest(): Promise<Video[]> {
    try {
      const response = await this.apiClient.get<Video[]>('LATEST');
      return response.data;
    } catch (error) {
      console.error('Error fetching videos:', error);
      return dummyVideos;
    }
  }

  async getTrending(): Promise<Video[]> {
    try {
      const response = await this.apiClient.get<Video[]>('TRENDING');
      return response.data;
    } catch (error) {
      console.error('Error fetching videos:', error);
      throw error;
    }
  }

  async getRecommend(): Promise<Video[]> {
    try {
      const response = await this.apiClient.get<Video[]>('RECOMMEND');
      return response.data;
    } catch (error) {
      console.error('Error fetching videos:', error);
      throw error;
    }
  }

  async trackEvent(event: VideoEvent): Promise<void> {
    try {
      await this.apiClient.post('TRACK_EVENT', event);
    } catch (error) {
      console.error('Error tracking event:', error);
      throw error;
    }
  }
}

export const videoService = new VideoService(ApiClient.getInstance());