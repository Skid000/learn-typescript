import { GraphOption } from '../types';
import { GridNode } from './gridNode';
import { Astar } from './astar';
export class Graph {
    public nodes: GridNode[];
    public diagonal: boolean;
    public grid: GridNode[][];
    public dirtyNodes: GridNode[];
    constructor(gridIn: number[][], options: GraphOption = {}) {
        this.nodes = [];
        this.diagonal = !!options.diagonal;
        this.grid = [];
        this.dirtyNodes = [];
        for (let x: number = 0; x < gridIn.length; x++) {
            this.grid[x] = [];
            for (let y: number = 0, row: number[] = gridIn[x]; y < row.length; y++) {
                let node: GridNode = new GridNode(x, y, row[y]);
                this.grid[x][y] = node;
                this.nodes.push(node);
            }
        }
        this.init();
    }
    init(): void {
        for (let i: number = 0; i < this.nodes.length; i++) {
            Astar.cleanNode(this.nodes[i]);
        }
    }
    cleanDirty(): void {
        for (let i: number = 0; i < this.dirtyNodes.length; i++) {
            Astar.cleanNode(this.dirtyNodes[i]);
        }
        this.dirtyNodes = [];
    }
    markDirty(node: GridNode): void {
        this.dirtyNodes.push(node);
    }
    neighbors(node: GridNode): GridNode[] {
        let ret: GridNode[] = [],
            x: number = node.x,
            y: number = node.y,
            grid: GridNode[][] = this.grid;
        if (grid[x - 1] && grid[x - 1][y]) {
            ret.push(grid[x - 1][y])
        }
        if (grid[x + 1] && grid[x + 1][y]) {
            ret.push(grid[x + 1][y])
        }
        if (grid[x] && grid[x][y - 1]) {
            ret.push(grid[x][y - 1])
        }
        if (grid[x] && grid[x][y + 1]) {
            ret.push(grid[x][y + 1])
        }
        if (this.diagonal) {
            if (grid[x - 1] && grid[x - 1][y - 1]) {
                ret.push(grid[x - 1][y - 1])
            }
            if (grid[x + 1] && grid[x + 1][y - 1]) {
                ret.push(grid[x + 1][y - 1])
            }
            if (grid[x - 1] && grid[x - 1][y + 1]) {
                ret.push(grid[x - 1][y + 1])
            }
            if (grid[x + 1] && grid[x + 1][y + 1]) {
                ret.push(grid[x + 1][y + 1])
            }
        }
        return ret
    }
    toString(): string {
        let graphString: string[] = [], nodes: GridNode[][] = this.grid;
        for (var x: number = 0; x < nodes.length; x++) {
            let rowDebug: number[] = [], row: GridNode[] = nodes[x];
            for (var y = 0; y < row.length; y++) {
                rowDebug.push(row[y].weight)
            }
            graphString.push(rowDebug.join(" "))
        }
        return graphString.join("\n")
    }
}
