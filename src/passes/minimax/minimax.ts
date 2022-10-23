import { Battlesnake, Board, MiniMaxMove } from "../../types";
import { deepCloneObject, deepCopyArray } from "../../util/Util";
import { Vector } from "../../util/vector";
import { State } from "./state";

export class MiniMax {
    private width: number;
    private height: number;
    private canWrap: boolean;
    private MAX_DEPTH: number;
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
    }
    bestMove(state: State, depth: number, maxPlayer: boolean, alpha: MiniMaxMove, beta: MiniMaxMove): MiniMaxMove {
        //console.log(`isMaxPlayer: ${maxPlayer}\nDepth: ${depth}`);
        const player = state.player,
            isPlayerTailSafe = player.length > 3,
            isEnemyTailSafe = isPlayerTailSafe,
            playerMoves = this.neighbours(Vector.from(player.head), state.grid, isPlayerTailSafe),
            enemy = this.selectEnemy(state),
            enemyMoves = this.neighbours(Vector.from(enemy.head), state.grid, isEnemyTailSafe),
            moves: Vector[] = maxPlayer ? playerMoves : enemyMoves;
        if (depth == this.MAX_DEPTH || !moves.length || !player.health || !enemy.health || player.head == enemy.head) {
            //console.log("Returning up tree");
            let score = this.score(state, playerMoves, enemyMoves);
            return { score: score, move: new Vector(0, 0) }
        }
        if (maxPlayer) {
            for (let move of moves) {
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
                if (newAlpha.score > alpha.score) {
                    console.log("Setting alpha value: ", newAlpha.score);
                    console.log("Setting alpha move: ", move);
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
        if (!playerMoves.length) return Number.MIN_SAFE_INTEGER;
        if (!state.player.health) return Number.MIN_SAFE_INTEGER;
        if (state.player.head.x == state.enemies[0].head.x && state.player.head.y == state.enemies[0].head.y) {
            if (state.player.length > state.enemies[0].length) return Number.MAX_SAFE_INTEGER;
            else return Number.MIN_SAFE_INTEGER;
        }
        const playerSquares = this.floodFill(new Vector(state.player.head.x, state.player.head.y), newBoard, 0, true),
            playerSquaresPercentage = playerSquares / (this.height * this.width),
            enemySquares = this.floodFill(new Vector(state.enemies[0].head.x, state.enemies[0].head.y), enemyBoard, 0, true),
            enemySquaresPercentage = enemySquares / (this.height * this.width);
        if (playerSquares <= state.player.length) return Number.MIN_SAFE_INTEGER * (1 / playerSquaresPercentage);
        if (enemySquares <= state.enemies[0].length) score = Number.MAX_SAFE_INTEGER;
        if (!enemyMoves.length) score = Number.MAX_SAFE_INTEGER;
        if (state.board.food.length <= 8) {
            foodWeight = 200 - (2 * state.player.health);
        } else if (state.player.health <= 40 || state.player.body.length < 4) {
            foodWeight = 100 - state.player.health;
        }
        if (foodWeight) {
            for (let i = 0; i < state.board.food.length; i++) {
                let food = state.board.food[i],
                    dist = new Vector(food.x, food.y).distanceTo(new Vector(state.player.head.x, state.player.head.y));
                score -= (dist * foodWeight) - i;
            }
        }
        !score ? score *= 1 / playerSquaresPercentage : score * playerSquaresPercentage;
        return score;
    }
    private floodFill(pos: Vector, grid: number[][], open: number, isFailSafe: boolean = false): number {
        if (!this.isSafeSquare(pos, grid, false, isFailSafe)) return open;
        grid[pos.x][pos.y] = MiniMax.types.filled;
        open++;
        let neighbours = this.neighbours(pos, grid);
        for (let n of neighbours) {
            open = this.floodFill(pos, grid, open);
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