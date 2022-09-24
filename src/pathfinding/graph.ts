import { GraphOption } from '../types';
import { GridNode } from './gridNode';
class Graph {
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

        }
    }
}
