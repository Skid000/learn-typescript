import { GameState, MoveResponse } from "./types";
import { populate } from "./passes/populate"
import { food } from "./passes/food";
import { direction } from "./passes/direction";
import { filled } from "./passes/floodfill";
import { dir2Vector, directionToAdjVector, dirToWrappedVector, removeElemFromArray, wrapVector } from "./util/Util";
import { Vector } from "./util/vector";
import { MiniMax } from "./passes/minimax/minimax";
import { State } from "./passes/minimax/state";
import { Shared } from "./persistence/shared";
import { stat } from "fs";
export function move(gameState: GameState, shared: Shared | undefined): MoveResponse {
  if (shared == undefined) return { move: '' };
  const origBoard = gameState.board,
    origSelf = gameState.you,
    turn = gameState.turn;
  let depth = 0, isWrapped = false;
  switch (origBoard.width) {
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
      depth = 6;
      break;
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
  switch (gameState.game.ruleset.name) {
    case "wrapped":
      isWrapped = true;
      break;
    case "constrictor":
      shared.didEat = true;
      break;
    default:
      //console.log(gameState.game.ruleset.name);
      break;
  }
  const max = new MiniMax(shared.member, origBoard.width, origBoard.height, depth, isWrapped),
    state = new State(origBoard, origSelf);
  /*
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
  */
  //console.log(shared.didEat);
  max.setIdx(state);
  //console.log(state.enemies[max.enemyIdx].name, max.enemyIdx);
  let miniMaxMove = max.bestMove(state, 0, true, {
    score: Number.MIN_SAFE_INTEGER,
    move: new Vector(0, 0)
  }, {
    score: Number.MAX_SAFE_INTEGER,
    move: new Vector(0, 0)
  }, state, shared.didEat);
  if (miniMaxMove.score == Number.MIN_SAFE_INTEGER) {
    max.changeDepth(2);
    miniMaxMove = max.bestMove(new State(origBoard, origSelf), 0, true, {
      score: Number.MIN_SAFE_INTEGER,
      move: new Vector(0, 0)
    }, {
      score: Number.MAX_SAFE_INTEGER,
      move: new Vector(0, 0)
    }, new State(origBoard, origSelf), shared.didEat);
  }
  if (Vector.from(origSelf.head).equals(shared.foodVec)) shared.resetFood();
    /*
    max.moves[0].sort((a, b) => (b.score - a.score));
    let dirToWorstMove = dirToWrappedVector(Vector.from(origSelf.head), max.moves[0][max.moves[0].length - 1].move, origBoard.width, origBoard.height),
        */let dirToBestMove = dirToWrappedVector(Vector.from(origSelf.head), miniMaxMove.move, origBoard.width, origBoard.height);
  // @ts-ignore
  //astarDestination = move != undefined && move?.valid ? Vector.from(origSelf.head).add(dir2Vector[move.moveResponse?.move]) : null;
  if (state.grid[miniMaxMove.move.x][miniMaxMove.move.y] == MiniMax.types.food) shared.setFood(Vector.from(miniMaxMove.move));
  /*  
  if (move != undefined && move.valid && move?.moveResponse?.move != dirToWorstMove) {
        // @ts-ignore
        if (state.grid[astarDestination.x][astarDestination.y] == MiniMax.types.food) shared.setFood(Vector.from(astarDestination));
        // @ts-ignore
        return move.moveResponse;
    }
  */
  return { move: dirToBestMove, shout: "got screwed lol" };
}