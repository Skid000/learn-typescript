import { SearchOption } from '../types';
import { BinaryHeap } from './BinaryHeap';
import { Graph } from './Graph';
import { GridNode } from './GridNode';
export class Astar {
    static cleanNode(node: GridNode): void {
        node.f = 0;
        node.g = 0;
        node.h = 0;
        node.visited = !1;
        node.closed = !1;
        node.parent = null
    }
    static getHeap(): BinaryHeap {
        return new BinaryHeap(function (node) { return node.f; });
    }
    static pathTo(node: GridNode): GridNode[] {
        let curr = node;
        let path = [];
        while (curr.parent) {
            path.unshift(curr);
            curr = curr.parent;
        }
        return path
    }
    static search(graph: Graph, start: GridNode, end: GridNode, options: SearchOption = {}): GridNode[] {
        graph.cleanDirty();
        var heuristic = options.heuristic || Astar.manhattan;
        var closest = options.closest || !1;
        var openHeap = Astar.getHeap();
        var closestNode = start;
        start.h = heuristic(start, end);
        graph.markDirty(start);
        openHeap.push(start);
        while (openHeap.size() > 0) {
            var currentNode = openHeap.pop();
            if (currentNode === end) {
                return Astar.pathTo(currentNode)
            }
            currentNode.closed = !0;
            var neighbors = graph.neighbors(currentNode);
            for (var i = 0, il = neighbors.length; i < il; ++i) {
                var neighbor = neighbors[i];
                if (neighbor.closed || neighbor.isWall()) {
                    continue
                }
                var gScore = currentNode.g + neighbor.getCost(currentNode);
                var beenVisited = neighbor.visited;
                if (!beenVisited || gScore < neighbor.g) {
                    neighbor.visited = !0;
                    neighbor.parent = currentNode;
                    neighbor.h = neighbor.h || heuristic(neighbor, end);
                    neighbor.g = gScore;
                    neighbor.f = neighbor.g + neighbor.h;
                    graph.markDirty(neighbor);
                    if (closest) {
                        if (neighbor.h < closestNode.h || (neighbor.h === closestNode.h && neighbor.g < closestNode.g)) {
                            closestNode = neighbor
                        }
                    }
                    if (!beenVisited) {
                        openHeap.push(neighbor)
                    } else {
                        openHeap.rescoreElement(neighbor)
                    }
                }
            }
        }
        if (closest) {
            return Astar.pathTo(closestNode)
        }
        return []
    }
    static manhattan(pos0: GridNode, pos1: GridNode): number {
        var d1: number = Math.abs(pos1.x - pos0.x);
        var d2: number = Math.abs(pos1.y - pos0.y);
        return d1 + d2
    }
}