import { Vector } from "../../util/vector";
import { State } from "./state";
import { MiniMax } from "./minimax";
import { deepCloneObject, deepCopyArray } from "../../util/Util";
export class Node {
    private parent: Node;
    private children: Node[];
    private state: State;
    public depth: number;
    private maximizingPlayer: boolean;
    private alpha: number;
    private beta: number;
    public isRoot: boolean;
    public move: Vector;
    private width: number;
    private height: number;
    private isPlayerTailSafe: boolean;
    constructor(isRoot: boolean, parent: Node, state: State, depth: number, maximizingPlayer: boolean, alpha: number, beta: number) {
        this.parent = parent;
        this.children = [];
        this.state = state;
        this.depth = depth;
        this.maximizingPlayer = maximizingPlayer;
        this.alpha = alpha;
        this.beta = beta;
        this.isRoot = isRoot;
        this.move = new Vector(0, 0);
        this.width = this.state.board.width;
        this.height = this.state.board.height;
        this.isPlayerTailSafe = this.state.player.length > 3;
    };
    backPropagate(): void {
        if (this.parent.isRoot) return;
        this.parent.alpha = this.alpha;
        this.parent.beta = this.beta;
        this.parent.backPropagate();
    }
    createChildren() {
        if (this.maximizingPlayer) this.maxPlayer();
        else this.maxEnemies();
    }
    maxEnemies() {

    }
    maxPlayer() {
        const moves = this.neighbours(Vector.from(this.state.player.head), this.state.grid, this.isPlayerTailSafe);
        for (let move of moves) {
            console.log(`Move: `, move);
            let newGrid = deepCopyArray(this.state.grid),
                newState: State = deepCloneObject(this.state),
                eating: boolean = false,
                length = newState.player.body.length - 1,
                isGrowing = length < 2,
                score = 0;
            if (newGrid[move.x][move.y] == MiniMax.types.food) {
                eating = true;
                newState.player.length += 1;
                newState.player.health = 100;
            } else newState.player.health -= 1;
            if (isGrowing) newGrid[newState.player.body[length].x][newState.player.body[length].y] = MiniMax.types.tail;
            else if (!eating) {
                newGrid[newState.player.body[length - 1].x][newState.player.body[length - 1].y] = MiniMax.types.tail;
                newGrid[newState.player.body[length].x][newState.player.body[length].y] = MiniMax.types.empty;
                newState.player.body.pop();
            }
            if(length) newGrid[newState.player.head.x][newState.player.head.y] = MiniMax.types.body;
            newGrid[move.x][move.y] = MiniMax.types.head;
            newState.player.head = move;
            newState.player.body.unshift(move);
            score = this.scoreState(moves,)

        }
    }
    private scoreState(playerMoves: Vector[],enemyMoves: Vector[]):number{
            let score = 0, newBoard = deepCopyArray(this.state.grid), enemyBoard = deepCopyArray(this.state.grid), foodWeight = 0,state = this.state;
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
    private isSafeSquare(vector: Vector, board: number[][], isTailSafe: boolean, isFailSafe: boolean = false): boolean {
        if (isFailSafe) return !0;
        let elem = board[vector.x][vector.y];
        return elem == MiniMax.types.empty || elem == MiniMax.types.food || elem == MiniMax.types.head || (isTailSafe && elem == MiniMax.types.tail);
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
}