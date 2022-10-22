import { GameState, MoveResponse } from "./types";
import { populate } from "./passes/populate"
import { food } from "./passes/food";
import { direction } from "./passes/direction";
import { filled } from "./passes/floodfill";
import { Astar } from "./pathfinding/Astar";
import { removeElemFromArray } from "./util/Util";
import { Vector } from "./util/vector";
import { MiniMax } from "./passes/minimax/minimax";
import { State } from "./passes/minimax/state";
export default function move(gameState: GameState): MoveResponse {
    const origBoard = gameState.board,
        origSelf = gameState.you,
        turn = gameState.turn,
        MM = new MiniMax(origBoard.width,origBoard.height,3),
        state = new State(origBoard,origSelf);
        MM.populateBoard(origBoard);
        MM.printBoard();
    let populatedBoard = populate(origBoard, origSelf), destinations = food(origBoard, populatedBoard, origSelf), move;
    astar: {
        if (destinations.length > 0) {
            move = direction(populatedBoard, destinations, origSelf);
            if(!move.valid) break astar;
            // @ts-ignore
            console.log(move.target,turn,filled(move.moveResponse,populatedBoard,origSelf,move.target));
            // @ts-ignore
            if(filled(move.moveResponse,populatedBoard,origSelf,move.target)){
                // @ts-ignore
                removeElemFromArray<Vector>(destinations,move.target);
                move = direction(populatedBoard, destinations, origSelf);
                if(!move.valid) break astar;
            }
        }
    }
    // @ts-ignore
    if(move.valid) return move.moveResponse;


    return { move: "down", shout: "hehe" };
}