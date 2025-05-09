import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { videoService } from '../api/services/videoService';
import { VideoEventType } from '../types/video';
const API_ENDPOINT = '/api/events/video'; // 실제 API 엔드포인트로 교체

const WatchPage: React.FC = () => {
    const { videoId } = useParams<{ videoId: string }>();
    const playerRef = useRef<any>(null);

    // 행동 데이터 전송
    const sendEvent = (eventType: VideoEventType, currentTime: number) => {
        if(!videoId) return;
        videoService.trackEvent({
            videoId,
            eventType,
            timestamp: new Date().toISOString(),
            currentTime,
        });
    };

    useEffect(() => {
        if(!videoId) return;

        function createPlayer() {
            playerRef.current = new window.YT.Player('youtube-player', {
                videoId,
                playerVars: {
                    autoplay: 1,
                    mute: 1,
                    controls: 0,
                    modestbranding: 1,
                    rel: 0,
                },
                events: {
                    onStateChange: (event: any) => {
                        const state = event.data;
                        const currentTime = event.target.getCurrentTime();
                        if (state === window.YT.PlayerState.PLAYING) sendEvent('play', currentTime);
                        else if (state === window.YT.PlayerState.PAUSED) sendEvent('pause', currentTime);
                        else if (state === window.YT.PlayerState.ENDED) sendEvent('end', currentTime);
                    },
                    onError: (event: any) => {
                        console.error('Youtube 플레이어 오류:', event);
                    },
                    
                }
            })
    
        }
        if(!window.YT){
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            document.body.appendChild(tag);
      window.onYouTubeIframeAPIReady = createPlayer;
        }else{
            createPlayer();
        }

        return () => {
            if(playerRef.current){
                sendEvent('exit', playerRef.current.getCurrentTime());
                playerRef.current.destroy();
            }
        };
    }, [videoId]);
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black">
        <div className="w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden">
          <div id="youtube-player" className="w-full h-full" />
        </div>
      </div>
    );
};

export default WatchPage;
    