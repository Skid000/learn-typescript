import { InfoResponse } from './types';
export function info(): InfoResponse {
    return {
        apiversion: "1",
        author: "",       // TODO: Your Battlesnake Username
        color: "#888888", // TODO: Choose color
        head: "default",  // TODO: Choose head
        tail: "default",  // TODO: Choose tail
    };
}
