import { GameState, MoveResponse } from "./types";
import { populate } from "./passes/populate"
export default function move(gameState: GameState): MoveResponse {
    const origBoard = gameState.board,
        origSelf = gameState.you,
        turn = gameState.turn;
    let populatedBoard = populate(origBoard, origSelf);
    
    return { move: "down" };
}