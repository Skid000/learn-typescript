import { Battlesnake, Board } from "../types";
import { Vector } from "../util/vector";
// find the closest available food pellet
export function food(board: Board, populatedBoard: number[][], self: Battlesnake): Vector | boolean {
    // if there's no food return false for differing to minimax
    if (!board.food.length) return !1;
    // set init dist to Infinity
    let dist = Infinity, fPellet, headVector = new Vector(self.head.x, self.head.y);
    // iterate through all food pellets
    for (let pellet of board.food) {
        // check if the food pellet is in a risk zone
        if (!populatedBoard[pellet.x][pellet.y]) continue;
        let vPellet = new Vector(pellet.x,pellet.y),distance = vPellet.distanceTo(headVector);
        if(distance > dist) continue;
        dist = distance;
        fPellet = vPellet;
    }
    return fPellet || false;
}