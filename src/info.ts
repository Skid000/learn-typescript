import { InfoResponse } from './types';
export default function info(): InfoResponse {
    return {
        apiversion: "1",
        author: "Invalid Username.",       // TODO: Your Battlesnake Username
        color: "#ffffff", // TODO: Choose color
        head: "default",  // TODO: Choose head
        tail: "default",  // TODO: Choose tail
    };
}
