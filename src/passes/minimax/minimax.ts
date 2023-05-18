import { stat } from "fs";
import { Astar } from "../../pathfinding/Astar";
import { Graph } from "../../pathfinding/Graph";
import { Battlesnake, Board, MiniMaxMove } from "../../types";
import { deepCloneObject, deepCopyArray, deepObjEquals, directionToAdjVector, distanceToWrapped, findSnake, wrapVector } from "../../util/Util";
import { Vector } from "../../util/vector";
import { populateWrapped } from "../populate";
import { State } from "./state";

export class MiniMax {
  private width: number;
  private height: number;
  private canWrap: boolean;
  private MAX_DEPTH: number;
  public enemyIdx: number;
  public moves: MiniMaxMove[][];
  public static types: { [key: string]: number; } = {
    hazard: 0,
    food: 1,
    head: 2,
    body: 3,
    tail: 4,
    empty: 5,
    filled: 6,
  }
  constructor(width: number, height: number, MAX_DEPTH: number, canWrap: boolean = false) {
    this.width = width;
    this.height = height;
    this.canWrap = canWrap;
    this.MAX_DEPTH = MAX_DEPTH;
    this.moves = [];
    for (let i = 0; i < MAX_DEPTH; i++) this.moves.push([]);
    this.enemyIdx = 0;
  }
  bestMove(state: State, depth: number, maxPlayer: boolean, alpha: MiniMaxMove, beta: MiniMaxMove, previousState: State, didEat: boolean = false): MiniMaxMove {
    //console.log(`Depth: ${depth}\nMaxingPlayer:${maxPlayer}`);
    alpha = deepCloneObject(alpha);
    beta = deepCloneObject(beta);
    const player = state.player,
      enemy = this.selectEnemy(state),
      isPlayerTailSafe = didEat ? false : player.length > 3,
      isEnemyTailSafe = enemy.length > 3,
      playerMoves = this.neighbours(Vector.from(player.head), state.grid, isPlayerTailSafe),
      enemyMoves = this.neighbours(Vector.from(enemy.head), state.grid, isEnemyTailSafe),
      moves: Vector[] = maxPlayer ? playerMoves : enemyMoves;
    if (depth == this.MAX_DEPTH || !moves.length || !player.health || !enemy.health || deepObjEquals(player.head, enemy.head)) {
      ////console.log("Returning up tree");
      //this.printBoard(state);
      let score = this.score(state, playerMoves, enemyMoves, previousState);
      //console.log(score);
      return { score: score, move: new Vector(0, 0) }
    }
    if (maxPlayer) {
      for (let move of moves) {
        //console.log('Cur move: ' + directionToAdjVector(Vector.from(player.head), move));
        let newState: State = deepCloneObject(state),
          newGrid = newState.grid,
          eating = !1,
          length = newState.player.body.length - 1,
          growing = length < 2;
        if (newGrid[move.x][move.y] == MiniMax.types.food) {
          eating = !0;
          newState.player.health = 100;
          newState.player.length++;
        } else newState.player.health--;
        if (growing) newGrid[newState.player.body[length].x][newState.player.body[length].y] = MiniMax.types.tail;
        else if (!eating) {
          newGrid[newState.player.body[length - 1].x][newState.player.body[length - 1].y] = MiniMax.types.tail;
          newGrid[newState.player.body[length].x][newState.player.body[length].y] = MiniMax.types.empty;
          newState.player.body.pop();
        }
        if (length) newGrid[newState.player.head.x][newState.player.head.y] = MiniMax.types.body;
        newGrid[move.x][move.y] = MiniMax.types.head;
        newState.player.head = move;
        newState.player.body.unshift(move);
        let newAlpha = this.bestMove(newState, depth + 1, false, alpha, beta, state);
        //console.log("Current alpha value: ", alpha.score);
        //console.log("Current alpha move: ", alpha.move);
        //console.log("Current newAlpha value: ", newAlpha.score);
        //console.log("Current newAlpha move: ", move);
        //this.printBoard(newState);
        // //console.log(newAlpha,depth);
        this.moves[depth].push({
          score: newAlpha.score,
          move: move
        });
        if (newAlpha.score > alpha.score) {
          //console.log("Setting alpha value: ", newAlpha.score);
          //console.log("Setting alpha move: ", move);
          alpha.score = newAlpha.score, alpha.move = move;
        }
        if (beta.score <= alpha.score) {
          break;
        }
      }
      return alpha;
    } else {
      for (let move of moves) {
        let newState: State = deepCloneObject(state),
          newGrid = newState.grid,
          eating = false,
          enemy = this.selectEnemy(newState),
          length = enemy.body.length - 1,
          growing = length < 2;
        //console.log('Cur move: ' + directionToAdjVector(Vector.from(enemy.head), move))
        if (newGrid[move.x][move.y] == MiniMax.types.food) {
          eating = true;
          enemy.health = 100;
          enemy.length++;
        } else enemy.health--;
        if (growing) newGrid[enemy.body[length].x][enemy.body[length].y] = MiniMax.types.tail;
        else if (!eating) {
          newGrid[enemy.body[length - 1].x][enemy.body[length - 1].y] = MiniMax.types.tail;
          newGrid[enemy.body[length].x][enemy.body[length].y] = MiniMax.types.empty;
          enemy.body.pop();
        }
        if (length) newGrid[enemy.head.x][enemy.head.y] = MiniMax.types.body;
        newGrid[move.x][move.y] = MiniMax.types.head;
        enemy.head = move;
        enemy.body.unshift(move);
        let newBeta = this.bestMove(newState, depth + 1, true, alpha, beta, state);
        if (newBeta.score < beta.score) {
          beta.score = newBeta.score, beta.move = move;
        }

        if (beta.score <= alpha.score) {
          break;
        }
      }
      return beta;
    }
  }
  private selectEnemy(state: State) {
    // TODO: make this smart!
    return state.enemies[this.enemyIdx];
  }
  public setIdx(state: State): void {
    let grid = populateWrapped(state, this.canWrap), graph = new Graph(grid, {
      diagonal: false,
      wrap: this.canWrap
    }), start = graph.grid[state.player.head.x][state.player.head.y], closestDist = Infinity, closest = 0;
    for (let idx = 0; idx < state.enemies.length; idx++) {
      let snake = state.enemies[idx], end = snake.head,
        path = distanceToWrapped(Vector.from(state.player.head), Vector.from(end), state.board.width, state.board.height);
      if (path < closestDist) {
        closest = idx;
        closestDist = path;
      }
    }
    for (let idx = 0; idx < state.enemies.length; idx++) {
      if (idx == closest) continue;
      let snake = state.enemies[idx],
        tail = snake.body[snake.body.length - 1];
      state.grid[tail.x][tail.y] = MiniMax.types.body;
    }
    this.enemyIdx = closest;
  }
  private score(state: State, playerMoves: Vector[], enemyMoves: Vector[], previousState: State): number {
    const a = 2, b = .1, c = 10, d = 2, e = 10;
    let score = 0, newBoard = deepCopyArray(state.grid), enemyBoard = deepCopyArray(state.grid), foodWeight = 0, enemy = this.selectEnemy(state), playerLength = state.player.length, enemyLength = enemy.length;
    // get sum of food locations weights then average it
    for (let i = 0; i < state.board.food.length; i++) {
      let food = state.board.food[i], dist = Vector.from(state.player.head).distanceTo(Vector.from(food)) + 1;
      foodWeight += 2500 / ((dist * (state.player.health)) ** ((state.player.length) / Math.sqrt(311)));
      console.log(dist);
    }
    foodWeight /= state.board.food.length * a;
    // score head on collison
    let headOnScore = 0;
    if (deepObjEquals(state.player.head, enemy.head)) {
      let enemyMovesLast = this.neighbours(Vector.from(this.selectEnemy(previousState).head), previousState.grid, true).length,
        playerMovesLast = this.neighbours(Vector.from(previousState.player.head), previousState.grid, true).length;
      headOnScore = 100 * Math.pow(Math.sqrt(1 - (enemyMovesLast / playerMovesLast)) * Math.sqrt(1 - ((enemyLength + 1) / playerLength)), 3)
    }
    // score area control
    let areaScore = 0, playerAreaControlled = this.floodFill(Vector.from(state.player.head), newBoard, 0, true), enemyControlled = this.floodFill(Vector.from(enemy.head), enemyBoard, 0, true);
    areaScore = ((playerAreaControlled * playerLength) - (enemyControlled * enemyLength)) / 10;
    // score our distance from our enemy
    let argoScore = 0, distToEnemy = Vector.from(state.player.head).distanceTo(Vector.from(enemy.head));
    argoScore = ((1000 * playerLength * Math.sqrt(1 - (enemyLength / playerLength))) / (distToEnemy * enemyLength)) - distToEnemy;
    // add everything into score
    //!isNaN(argoScore) && (score += argoScore * b);
    score += areaScore * c; //make area bigger
    score += foodWeight * d;
    score += headOnScore * e; // make head on bigger
    console.log(`ArgS: ${argoScore}\nAreaS: ${areaScore}\nFoodW: ${foodWeight}\nHoS: ${headOnScore}\n`);
    // implement conditions
    if (isNaN(headOnScore)) score = -Infinity; // enemy bigger then us OR they have more moves then us in a headon
    if (state.player.health <= 0 || playerMoves.length == 0) score = -Infinity; // we died in this state
    if (enemy.health <= 0) score = Infinity; // the enemy died
    return score;
  }
  private floodFill(pos: Vector, grid: number[][], open: number, isFailSafe: boolean = false): number {
    if (!this.isSafeSquare(pos, grid, false, isFailSafe)) return open;
    grid[pos.x][pos.y] = MiniMax.types.filled;
    open++;
    let neighbours = this.neighbours(pos, grid);
    for (let n of neighbours) {
      open = this.floodFill(n, grid, open);
    }
    return open;
  }

  neighbours(vector: Vector, board: number[][], isTailSafe: boolean = false): Vector[] {
    let pNeighbors = [
      new Vector(vector.x + 1, vector.y),
      new Vector(vector.x - 1, vector.y),
      new Vector(vector.x, vector.y + 1),
      new Vector(vector.x, vector.y - 1),
    ], result: Vector[] = [];
    if (this.canWrap) {
      for (let i in pNeighbors) {
        if (this.isValidVector(pNeighbors[i])) continue;
        wrapVector(pNeighbors[i], this.width, this.height);
      }
    }
    for (let n of pNeighbors) if (this.isValidVector(n) && this.isSafeSquare(n, board, isTailSafe)) result.push(n);
    return result;
  }
  private isValidVector(vector: Vector): boolean {
    return vector.x >= 0 && vector.x < this.width &&
      vector.y >= 0 && vector.y < this.height;
  }
  private isSafeSquare(vector: Vector, board: number[][], isTailSafe: boolean, isFailSafe: boolean = false): boolean {
    if (isFailSafe) return !0;
    let elem = board[vector.x][vector.y];
    return elem == MiniMax.types.empty || elem == MiniMax.types.food || elem == MiniMax.types.head || (isTailSafe && elem == MiniMax.types.tail);
  }
  printBoard(state: State): void {
    let boardString = "";
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        let elem = state.grid[x][y];
        switch (elem) {
          case MiniMax.types.hazard:
            boardString += "[X] ";
            break;
          case MiniMax.types.food:
            boardString += "[#] ";
            break;
          case MiniMax.types.empty:
            boardString += "[ ] ";
            break;
          case MiniMax.types.head:
            boardString += "[Y] ";
            break;
          case MiniMax.types.body:
            boardString += "[+] ";
            break;
          case MiniMax.types.tail:
            boardString += "[*] ";
            break;
          case MiniMax.types.filled:
            boardString += "[O] ";
            break;
        }
      }
      boardString += "\n";
    }
    //console.log(boardString);
  }
}