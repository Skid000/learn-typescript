import { TemplateHead } from "typescript";
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
export function directionToAdjVector(a: Vector, b: Vector): string {
    let fDir = 'none';
    for (let dir in dir2Vector) {
        if (a.add(dir2Vector[dir]).equals(b)) {
            fDir = dir;
            break;
        }
    }
    return fDir;
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
export function deepCopyArray(array: number[][]): number[][] {
    return array.map(a => a.slice())
}
export function deepCloneObject(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
}
export function deepEquals(a: number[][], b: number[][]): boolean {
    if (a.length !== b.length || a[0].length !== b[0].length) return false;
    for (let i = 0; i < a.length; i++) {
        for (let t = 0; t < a[i].length; t++) {
            if (a[i][t] !== b[i][t]) return false;
        }
    }
    return true;
}
export function removeElemFromArray<Type>(array: Type[], element: Type): void {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === element) {
            array.splice(i, 1);
            return;
        }
    }
    return;
}