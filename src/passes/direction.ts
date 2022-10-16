import { Astar } from "../pathfinding/Astar";
import { Graph } from "../pathfinding/Graph";
import { Battlesnake, MoveResponse } from "../types";
import { directionToNextGridNode } from "../util/directionUtil";
import { Vector } from "../util/vector";

export function direction(populatedBoard: number[][], destinations: Vector[], self: Battlesnake): MoveResponse{
    let graph = new Graph(populatedBoard, { diagonal: false }),
        start = graph.grid[self.head.x][self.head.y],
        path,end;
    // iterate through all possible destinations from shortest to longest distance 
    for (let vector of destinations) {
        end = graph.grid[vector.x][vector.y];
            let pPath = Astar.search(graph, start, end);
        // if the destination is reachable use that path
        if (pPath.length > 0) {
            path = pPath;
            break;
        }
    }
    // if no destination is reachable return "false" so we can differ to minimax
    if (!path) return {
        move: "null"
    };
    // return direction to the next gridnode
    return directionToNextGridNode(path,self);
}