import { GameState, MoveResponse } from "./types";
import { populate } from "./passes/populate"
export default function move(gameState: GameState): MoveResponse {
    const origBoard = gameState.board,
        origSelf = gameState.you;
    let populatedBoard = populate(origBoard, origSelf);
    let string = "";
    for (let x = 0; x < populatedBoard.length; x++) {
        for (let y = 0; y < populatedBoard[x].length; y++) {
            string += populatedBoard[x][y] + ",";
        }
        string += "\n";
    }
    console.log(string)
    return { move: "down" };
}