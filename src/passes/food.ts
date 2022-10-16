import { Battlesnake, Board } from "../types";
import { Vector } from "../util/vector";
// find the closest available food pellet
export function food(board: Board, populatedBoard: number[][], self: Battlesnake): Vector[]{
    // if there's no food return false for differing to minimax
    if (!board.food.length) return [];
    // set init dist to Infinity
    let fPellet = [], headVector = new Vector(self.head.x, self.head.y);
    // iterate through all food pellets and create vector versions along with removing all "unsafe" pellets
    for (let pellet of board.food) if (populatedBoard[pellet.x][pellet.y]) fPellet.push(new Vector(pellet.x, pellet.y));
    // sort fPellet by distance to head
    fPellet.sort((a, b) => {
        return a.distanceTo(headVector) - b.distanceTo(headVector);
    });
    return fPellet;
}