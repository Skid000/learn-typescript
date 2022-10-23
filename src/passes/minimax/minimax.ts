import { Battlesnake, Board, MiniMaxMove } from "../../types";
import { deepCloneObject, deepCopyArray, deepObjEquals, directionToAdjVector, wrapVector } from "../../util/Util";
import { Vector } from "../../util/vector";
import { State } from "./state";

export class MiniMax {
    private width: number;
    private height: number;
    private canWrap: boolean;
    private MAX_DEPTH: number;
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
    }
    bestMove(state: State, depth: number, maxPlayer: boolean, alpha: MiniMaxMove, beta: MiniMaxMove, didEat: boolean = false): MiniMaxMove {
        //console.log(`Depth: ${depth}\nMaxingPlayer:${maxPlayer}`);
        alpha = deepCloneObject(alpha);
        beta = deepCloneObject(beta);
        const player = state.player,
            isPlayerTailSafe = didEat ? false : player.length > 3,
            isEnemyTailSafe = player.length > 3,
            playerMoves = this.neighbours(Vector.from(player.head), state.grid, isPlayerTailSafe),
            enemy = this.selectEnemy(state),
            enemyMoves = this.neighbours(Vector.from(enemy.head), state.grid, isEnemyTailSafe),
            moves: Vector[] = maxPlayer ? playerMoves : enemyMoves;
        if (depth == this.MAX_DEPTH || !moves.length || !player.health || !enemy.health || deepObjEquals(player.head, enemy.head)) {
            //console.log("Returning up tree");
            //this.printBoard(state);
            let score = this.score(state, playerMoves, enemyMoves);
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
                let newAlpha = this.bestMove(newState, depth + 1, false, alpha, beta);
                //console.log("Current alpha value: ", alpha.score);
                //console.log("Current alpha move: ", alpha.move);
                //console.log("Current newAlpha value: ", newAlpha.score);
                //console.log("Current newAlpha move: ", move);
                //this.printBoard(newState);
                // console.log(newAlpha,depth);
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
                //console.log('Cur move: ' + directionToAdjVector(Vector.from(enemy.head), move))
                let newState: State = deepCloneObject(state),
                    newGrid = newState.grid,
                    eating = false,
                    length = newState.enemies[0].body.length - 1,
                    growing = length < 2;
                if (newGrid[move.x][move.y] == MiniMax.types.food) {
                    eating = true;
                    newState.enemies[0].health = 100;
                    newState.enemies[0].length++;
                } else newState.enemies[0].health--;
                if (growing) newGrid[newState.enemies[0].body[length].x][newState.enemies[0].body[length].y] = MiniMax.types.tail;
                else if (!eating) {
                    newGrid[newState.enemies[0].body[length - 1].x][newState.enemies[0].body[length - 1].y] = MiniMax.types.tail;
                    newGrid[newState.enemies[0].body[length].x][newState.enemies[0].body[length].y] = MiniMax.types.empty;
                    newState.enemies[0].body.pop();
                }
                if (length) newGrid[newState.enemies[0].head.x][newState.enemies[0].head.y] = MiniMax.types.body;
                newGrid[move.x][move.y] = MiniMax.types.head;
                newState.enemies[0].head = move;
                newState.enemies[0].body.unshift(move);
                let newBeta = this.bestMove(newState, depth + 1, true, alpha, beta);
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
        return state.enemies[0];
    }
    private score(state: State, playerMoves: Vector[], enemyMoves: Vector[]): number {
        let score = 0, newBoard = deepCopyArray(state.grid), enemyBoard = deepCopyArray(state.grid), foodWeight = 0;
        if (!playerMoves.length || !state.player.health) return Number.MIN_SAFE_INTEGER;
        if (!enemyMoves.length || !state.enemies[0].health) return Number.MAX_SAFE_INTEGER;
        if (deepObjEquals(state.player.head, state.enemies[0].head)) {
            return state.player.length > state.enemies[0].length ? Number.MAX_SAFE_INTEGER : Number.MIN_SAFE_INTEGER;
        }
        let avaliableSquares = this.floodFill(Vector.from(state.player.head), newBoard, 0, true),
            percentAvaliable = avaliableSquares / (this.width * this.height),
            enemySquares = this.floodFill(Vector.from(state.enemies[0].head), enemyBoard, 0, true);
        //console.log('Squares: %d', avaliableSquares);
        //console.log('Percentage: %d%', percentAvaliable);
        if (avaliableSquares <= state.player.length && avaliableSquares <= enemySquares) return Number.MIN_SAFE_INTEGER;
        else if (avaliableSquares <= state.player.length) return -(10 ** 8) * (1 / percentAvaliable);
        if (enemySquares <= state.enemies[0].length) score += 10 ** 8;
        if (state.board.food.length <= 8) {
            foodWeight = 200 - (2 * state.player.health)
        } else if (state.board.food.length <= 11) {
            foodWeight = 300 - (3 * state.player.health);
        } else if (state.player.health <= 50 || state.player.body.length < 4) {
            foodWeight = 100 - state.player.health;
        }
        if (foodWeight) {
            for (let i = 0; i < state.board.food.length; i++) {
                score -= (Vector.from(state.player.head).distanceTo(Vector.from(state.board.food[i])))
            }
        }
        if (score > 0) {
            score *= percentAvaliable;
        } else score *= 1 / percentAvaliable;
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

    private neighbours(vector: Vector, board: number[][], isTailSafe: boolean = false): Vector[] {
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
        console.log(boardString);
    }
}