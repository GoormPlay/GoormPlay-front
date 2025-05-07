export {}; // 모듈로 인식시키기 위해 필요

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: typeof YT;
  }
}