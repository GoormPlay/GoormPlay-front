import ReactGA from 'react-ga4';

export const initGA = () => {
    ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID || 'G-XXXXXXXXXX');
}

export const logEvent = (category: string, action: string, label?: string) => {
    ReactGA.event({
        category,
        action,
        label,
    });
}
export const logPageView = (path: string) => {
    ReactGA.send({
        hitType: 'pageview',
        page: path,
    });
}

export const logVideoEvent = (videoId: string, eventType: string, currentTime?: number) => {
    ReactGA.event({
        category: 'Video',
        action: eventType,
        label: videoId,
        value: currentTime,
    });
}
export const logUserEvent = (userId: string, eventType: string) => {    
    ReactGA.event({
        category: 'User',
        action: eventType,
        label: userId,
    });
}
//   name: string;
//   email: string;
//   password: string;
//   subscription: string;
//   liked: VideoCard[];