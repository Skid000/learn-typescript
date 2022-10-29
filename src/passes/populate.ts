import { Battlesnake, Board } from "../types"
import { dir2Vector, wrapVector } from "../util/Util";
import { Vector } from "../util/vector";
import { State } from "./minimax/state";
export function populateWrapped(state: State, isWrapped: boolean): number[][] {
    let grid = new Array(state.board.width).fill([]);
    for (let col in grid) grid[col] = new Array(state.board.height).fill(1);
    for (let hazards of state.board.hazards) grid[hazards.x][hazards.y] = 0;
    for (let body of state.player.body) grid[body.x][body.y] = 0;
    for (let snake of state.enemies) {
        for (let body of snake.body) grid[body.x][body.y] = 0;
        for (let dir in dir2Vector) {
            let newHead = Vector.from(snake.head).add(dir2Vector[dir]);
            isWrapped ? (wrapVector(newHead, state.board.width, state.board.height), grid[newHead.x][newHead.y] = 0) : (
                grid[newHead.x] != undefined && grid[newHead.x][newHead.y] != undefined && (grid[newHead.x][newHead.y] = 0)
            );
        }
    }
    return grid;
}
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
    // pad edges with lower passability
    for (var x = 0; x < gameState.length; x++) {
        for (var y = 0; y < gameState[x].length; y++) {
            if (!x || x == gameState.length - 1) {
                gameState[x][y] = 3;
            } else if (!y || y == gameState[x].length - 1) {
                gameState[x][y] = 3;
            }
        }
    }
    // populate board with all hazards
    for (let hazards of board.hazards) gameState[hazards.x][hazards.y] = 0;
    // populate board with snake parts
    for (let snake of board.snakes) {
        // populate board with snake bodies regardless of snake
        for (let part of snake.body) gameState[part.x][part.y] = 0;
        // remove snake tails from board TODO: figure out how this impacts gameplay
        // gameState[snake.body[snake.body.length - 1].x][snake.body[snake.body.length - 1].y] = 1;
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