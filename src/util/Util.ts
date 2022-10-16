import { GridNode } from "../pathfinding/GridNode";
import { Battlesnake, Board, MoveResponse } from "../types";
import { Vector } from "./vector";
export const dir2Vector: { [key: string]: Vector; } = {
    left: new Vector(-1, 0),
    right: new Vector(1, 0),
    down: new Vector(0, -1),
    up: new Vector(0, 1)
}
export function directionToNextGridNode(path: GridNode[], self: Battlesnake): MoveResponse {
    let cur = new Vector(self.head.x, self.head.y),
        next = new Vector(path[0].x, path[0].y),
        fDir = "null";
    for (let dir in dir2Vector) {
        if (cur.add(dir2Vector[dir]).equals(next)) {
            fDir = dir;
            break;
        }
    }
    return {
        move: fDir,
    }
}
export function validMoves(populatedBoard: number[][], board: Board, id: string): Vector[] {
    let snake = findSnake(board, id), moves: Vector[] = [], head = new Vector(snake.head.x, snake.head.y);
    for (let dir in dir2Vector) {
        let newPos = head.add(dir2Vector[dir]);
        if (populatedBoard[newPos.x] == undefined) continue;
        if (populatedBoard[newPos.x][newPos.y] == undefined) continue;
        if (populatedBoard[newPos.x][newPos.y]) moves.push(dir2Vector[dir]);
    }
    return moves;

}
export function findSnake(board: Board, id: string): Battlesnake {
    // @ts-ignore
    return board.snakes.find(snake => snake.id === id);
}