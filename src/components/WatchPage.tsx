import React, { useEffect, useRef, useCallback } from 'react';
import { useParams} from 'react-router-dom';
import { userInteractionService } from '../api/services/UserInteractionService';
import { VideoEventType } from '../api/types';

const WatchPage: React.FC = () => {
    const { videoId } = useParams<{ videoId: string }>();
    const playerRef = useRef<any>(null);

    const sendEvent = useCallback((eventType: VideoEventType, currentTime: number, duration: number) => {
        if (!videoId) return;
        const watchProgress = (currentTime / duration) * 100;
        userInteractionService.trackEvent(videoId, eventType, new Date().toISOString(), watchProgress);
    }, [videoId]);

    useEffect(() => {
        if (!videoId) return;

        function createPlayer() {
            if (!videoId) return;
            
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
                        if (!videoId) return;
                        const state = event.data;
                        const currentTime = event.target.getCurrentTime();
                        const duration = event.target.getDuration();
                        
                        if (state === window.YT.PlayerState.PLAYING) {
                            sendEvent('play_start', currentTime, duration);
                        } else if (state === window.YT.PlayerState.PAUSED) {
                            sendEvent('play_pause', currentTime, duration);
                        } else if (state === window.YT.PlayerState.ENDED) {
                            sendEvent('play_end', currentTime, duration);
                        }
                    },
                    onError: (event: any) => {
                        console.error('Youtube 플레이어 오류:', event);
                    },
                }
            });
        }

        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            document.body.appendChild(tag);
            window.onYouTubeIframeAPIReady = createPlayer;
        } else {
            createPlayer();
        }

        return () => {
            if (playerRef.current && videoId) {
                const currentTime = playerRef.current.getCurrentTime();
                const duration = playerRef.current.getDuration();
                sendEvent('play_exit', currentTime, duration);
                playerRef.current.destroy();
            }
        };
    }, [videoId, sendEvent]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black">
            <div className="w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden">
                <div id="youtube-player" className="w-full h-full" />
            </div>
        </div>
    );
};

export default WatchPage;
    