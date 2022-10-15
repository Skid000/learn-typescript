import { Battlesnake, Board } from "../types"
import { Vector } from "../util/vector";
export function populate(board: Board, self: Battlesnake): number[][] {
    // head branching directions
    const DIRS = [
        new Vector(-1, 0),
        new Vector(0, -1),
        new Vector(1, 0),
        new Vector(0, 1)
    ];
    // create empty board with all passable squares
    let gameState = new Array(board.width).fill([]);
    for (let col in gameState) gameState[col] = new Array(board.height).fill(1);
    // populate board with all hazards
    for (let hazards of board.hazards) gameState[hazards.x][hazards.y] = 0;
    // populate board with snake parts
    for (let snake of board.snakes) {
        // populate board with snake bodies regardless of snake
        for (let part of snake.body) gameState[part.x][part.y] = 0;
        // remove snake tails from board
        gameState[snake.body[snake.body.length - 1].x][snake.body[snake.body.length - 1].y] = 1;
        // remove snake heads of smaller snakes and self
        if (snake.id == self.id || snake.length < self.length) {
            gameState[snake.head.x][snake.head.y] = 1;
            continue;
        }
        // TODO: have minimax come into consideration?
        // TODO: board wrapping come into consideration?
        // add head branching to board
        for (let dir of DIRS) {
            const newHead = {
                x: snake.head.x + dir.x,
                y: snake.head.y + dir.y
            }
            if (gameState[newHead.x] == undefined) continue;
            if (gameState[newHead.x][newHead.y] == undefined) continue;
            gameState[newHead.x][newHead.y] = 0;
        }
    }
    return gameState;
}