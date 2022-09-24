export class GridNode{
    public x: number;
    public y: number;
    public weight: number;
    constructor(x: number, y: number,weight: number){
        this.x = x;
        this.y = y;
        this.weight = weight;
    }
    toString():string{
        return `[${this.x},${this.y}]`;
    }
    getCost(fromNeighbor: GridNode): number{
        if (fromNeighbor && fromNeighbor.x != this.x && fromNeighbor.y != this.y) {
            return this.weight * 1.41421
        }
        return this.weight
    };
    isWall():boolean{
        return this.weight === 0;
    }
}