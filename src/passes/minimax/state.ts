import { Battlesnake, Board } from "../../types";
import { MiniMax } from "./minimax";
export class State {
    public board: Board;
    public player: Battlesnake;
    public enemies: Battlesnake[];
    public grid: number[][];
    constructor(board: Board, self: Battlesnake) {
        this.board = board;
        this.player = self;
        this.enemies = [];
        board.snakes.forEach(e => e.id != this.player.id && this.enemies.push(e));
        this.grid = this.createEmptyBoard();
        this.populateBoard();
    }
    private createEmptyBoard(): number[][] {
        let board = new Array(this.board.width).fill([]);
        for (let x in board) board[x] = new Array(this.board.height).fill(MiniMax.types.empty);
        return board;
    }
    private populateBoard(): void {
        // add food
        for (let food of this.board.food) this.grid[food.x][food.y] = MiniMax.types.food;
        // add hazard
        for (let hazard of this.board.hazards) this.grid[hazard.x][hazard.y] = MiniMax.types.hazard;
        // bodies
        for (let snake of this.board.snakes) {
            for (let i = 0; i < snake.body.length; i++) {
                let body = snake.body[i];
                this.grid[body.x][body.y] = !i ? MiniMax.types.head : i == snake.body.length - 1 ? MiniMax.types.tail : MiniMax.types.body;
            }
        }
    }
}