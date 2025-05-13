export interface Video {
  id: string;
  kind: string;
  genre: string[];
  title: string;
  videoId: string;
  thumbnail: string;
  synopsis: string;
}

export type VideoEventType = 'play' | 'pause' | 'end' | 'exit' | 'time';

export interface VideoEvent {
  videoId: string;
  eventType: VideoEventType;
  timestamp: string;
  currentTime: number;
}