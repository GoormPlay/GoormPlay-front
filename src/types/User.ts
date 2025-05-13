import { Video } from "./video";

export interface User {
    id: string;
    username: string;
    password: string;
    subscription: string;
    liked: Video[];
}