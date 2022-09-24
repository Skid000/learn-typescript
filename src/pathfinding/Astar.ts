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
}