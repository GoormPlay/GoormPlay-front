export interface Video {
  id: string;
  title: string;
  videoId: string;
  thumbnail: string;
  description: string;
}

export type VideoEventType = 'play' | 'pause' | 'end' | 'exit' | 'time';

export interface VideoEvent {
  videoId: string;
  eventType: VideoEventType;
  timestamp: string;
  currentTime: number;
}