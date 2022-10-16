import { GridNode } from "../pathfinding/GridNode";
import { Battlesnake, MoveResponse } from "../types";
import { Vector } from "./vector";
export function directionToNextGridNode(path: GridNode[], self: Battlesnake): MoveResponse {
    const dir2Vector: { [key: string]: Vector; } = {
        left: new Vector(-1, 0),
        right: new Vector(1, 0),
        down: new Vector(0, -1),
        up: new Vector(0, 1)
    }

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