import { Battlesnake, MoveResponse } from "../types";
import { deepCopyArray, deepEquals, dir2Vector } from "../util/Util";
import { Vector } from "../util/vector";

export function filled(direction: MoveResponse, populatedBoard: number[][], self: Battlesnake, target: Vector): boolean {
    populatedBoard = deepCopyArray(populatedBoard);
    let directionVec = dir2Vector[direction.move],headVec = new Vector(self.head.x, self.head.y);
    populatedBoard[self.head.x][self.head.y] = 0;
    if(!headVec.add(directionVec).equals(target)) populatedBoard[self.head.x + directionVec.x][self.head.y + directionVec.y] = 0;
    let filledMatrix = fill(populatedBoard, target.x, target.y), openMatrix = new Array(populatedBoard.length).fill(new Array(populatedBoard[0].length).fill(0));
    if (deepEquals(openMatrix, filledMatrix)) return false;
    return true;

}
function fill(matrix: number[][], pX: number, pY: number): number[][] {
    let fillStack = [];
    fillStack.push([pX, pY]);
    matrix = deepCopyArray(matrix);
    while (fillStack.length > 0) {
        // @ts-ignore
        let [x, y] = fillStack.pop();
        if (x < 0 || y < 0 || x >= matrix.length || y >= matrix[0].length) {
            continue;
        }
        if (!matrix[x][y]) continue;
        matrix[x][y] = 0;
        fillStack.push([x + 1, y]);
        fillStack.push([x - 1, y]);
        fillStack.push([x, y + 1]);
        fillStack.push([x, y - 1]);
    }
    return matrix;
}
