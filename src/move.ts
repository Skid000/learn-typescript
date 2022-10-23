import { GameState, MoveResponse } from "./types";
import { populate } from "./passes/populate"
import { food } from "./passes/food";
import { direction } from "./passes/direction";
import { filled } from "./passes/floodfill";
import { Astar } from "./pathfinding/Astar";
import { dir2Vector, directionToAdjVector, dirToWrappedVector, removeElemFromArray } from "./util/Util";
import { Vector } from "./util/vector";
import { MiniMax } from "./passes/minimax/minimax";
import { State } from "./passes/minimax/state";
export default function move(gameState: GameState): MoveResponse {
    const origBoard = gameState.board,
        origSelf = gameState.you,
        turn = gameState.turn;
        let depth = 0,isWrapped = false;
        switch(origBoard.width){
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                depth = 8;
                break;
            case 8:
            case 9:
            case 10:
            case 11:
                depth = 7;
            case 12:
            case 13:
            case 14:
            case 15:
            case 16:
            case 17:
            case 18:
            case 19:
                depth = 5;
                break;
            default: 
                depth = 4;
                break;
        }
        switch(gameState.game.ruleset.name){
            case "wrapped":
                isWrapped = true;
                break;
        }
        const max = new MiniMax(origBoard.width, origBoard.height, depth,isWrapped),
        state = new State(origBoard, origSelf);
    let populatedBoard = populate(origBoard, origSelf), destinations = food(origBoard, populatedBoard, origSelf), move;
    astar: {
        if (destinations.length > 0) {
            move = direction(populatedBoard, destinations, origSelf);
            if (!move.valid) break astar;
            // @ts-ignore
            //console.log(move.target, turn, filled(move.moveResponse, populatedBoard, origSelf, move.target));
            // @ts-ignore
            if (filled(move.moveResponse, populatedBoard, origSelf, move.target)) {
                // @ts-ignore
                removeElemFromArray<Vector>(destinations, move.target);
                move = direction(populatedBoard, destinations, origSelf);
                if (!move.valid) break astar;
            }
        }
    }
    let miniMaxMove = max.bestMove(state, 0, true, {
        score: Number.MIN_SAFE_INTEGER,
        move: new Vector(0, 0)
    }, {
        score: Number.MAX_SAFE_INTEGER,
        move: new Vector(0, 0)
    }); max.moves[0].sort((a, b) => (b.score - a.score));
    let dirToWorstMove = dirToWrappedVector(Vector.from(origSelf.head), max.moves[0][max.moves[0].length - 1].move,origBoard.width,origBoard.height),
        dirToBestMove = dirToWrappedVector(Vector.from(origSelf.head), miniMaxMove.move,origBoard.width,origBoard.height);
    // @ts-ignore
    if (move != undefined && move.valid && move?.moveResponse?.move != dirToWorstMove) return move.moveResponse;
    return { move: dirToBestMove, shout: "got screwed lol" };
}