import { GameState, MoveResponse } from "./types";
import { populate } from "./passes/populate"
import { food } from "./passes/food";
import { direction } from "./passes/direction";
export default function move(gameState: GameState): MoveResponse {
    const origBoard = gameState.board,
        origSelf = gameState.you,
        turn = gameState.turn;
    let populatedBoard = populate(origBoard, origSelf), destinations = food(origBoard, populatedBoard, origSelf), mDir;
    if (destinations.length > 0) {
        let dir = direction(populatedBoard, destinations, origSelf);
        if (dir.move != "null")
            return dir;
    }

    return { move: "down", shout: "hehe" };
}