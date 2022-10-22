import { Battlesnake, Board } from "../../types";
import { deepCopyArray } from "../../util/Util";
import { Vector } from "../../util/vector";
import { State } from "./state";

export class MiniMax {
    private width: number;
    private height: number;
    private board: number[][];
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
        this.board = this.createEmptyBoard();
        this.canWrap = canWrap;
        this.MAX_DEPTH = MAX_DEPTH;
    }
    bestMoves(state: State): Vector[] {
       let gState = state;
       


    }
    private score(state: State, playerMoves: Vector[], enemyMoves: Vector[]): number {
        let score = 0, newBoard = deepCopyArray(this.board), enemyBoard = deepCopyArray(this.board), foodWeight = 0;
        if (!playerMoves.length) return -Infinity;
        if (!state.player.health) return -Infinity;
        if (state.player.head.x == state.enemies[0].head.x && state.player.head.y == state.enemies[0].head.y) {
            if (state.player.length > state.enemies[0].length) return Infinity;
            else return -Infinity;
        }
        const playerSquares = this.floodFill(new Vector(state.player.head.x, state.player.head.y), newBoard, 0, true),
            playerSquaresPercentage = playerSquares / (this.height * this.width),
            enemySquares = this.floodFill(new Vector(state.enemies[0].head.x, state.enemies[0].head.y), enemyBoard, 0, true),
            enemySquaresPercentage = enemySquares / (this.height * this.width);
        if (playerSquares <= state.player.length) return Number.MIN_SAFE_INTEGER * (1 / playerSquaresPercentage);
        if (enemySquares <= state.enemies[0].length) score += Number.MAX_SAFE_INTEGER;
        if (!enemyMoves.length) score += Infinity;
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
    printBoard(): void {
        let boardString = "";
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                let elem = this.board[x][y];
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