import { MoveResponse } from "../types";

export function filled(direction: MoveResponse, populatedBoard: number[][]): boolean {

}
function fill(matrix: number[][], x: number[], y: number[]) {
    let fillStack = [];
    fillStack.push([x, y]);
    matrix = [...matrix];
    while (fillStack.length > 0) {
        // @ts-ignore
        let [x, y] = fillStack.pop();
        if (x < 0 || y < 0 || x >= matrix.length || y >= matrix[0].length) {
            continue;
        }
        if (matrix[x][y] == 0)
            continue;
        matrix[x][y] = 0;

    }
}
