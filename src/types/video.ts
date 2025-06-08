export interface Video {
  videoId: string;
  kind: string;
  genre: string[];
  title: string;
  thumbnail: string;
  synopsis: string;
  trending?: boolean;
  latest?: boolean;
  personalized?: boolean;
}

export interface VideoPreview {
  videoId: string;
  title: string;
  genre: string[];
}

export type VideoEventType = 'play' | 'pause' | 'end' | 'exit' | 'time';

export interface VideoEvent {
  videoId: string;
  eventType: VideoEventType;
  timestamp: string;
  currentTime: number;
}