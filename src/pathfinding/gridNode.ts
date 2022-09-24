export class GridNode {
    public x: number;
    public y: number;
    public weight: number;
    public f: number;
    public g: number;
    public h: number;
    public visited: boolean;
    public closed: boolean;
    public parent: null | GridNode;
    constructor(x: number, y: number, weight: number) {
        this.x = x;
        this.y = y;
        this.weight = weight;
        this.f = this.g = this.h = 0;
        this.visited = this.closed = !1;
        this.parent = null;
    }
    toString(): string {
        return `[${this.x},${this.y}]`;
    }
    getCost(fromNeighbor: GridNode): number {
        if (fromNeighbor && fromNeighbor.x != this.x && fromNeighbor.y != this.y) {
            return this.weight * 1.41421
        }
        return this.weight
    };
    isWall(): boolean {
        return this.weight === 0;
    }
}