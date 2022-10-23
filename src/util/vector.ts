import { Coord } from "../types";

export class Vector {
    public x: number;
    public y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    distanceTo(vector: Vector): number {
        return Math.sqrt((this.x - vector.x) ** 2 + (this.y - vector.y) ** 2);
    }
    add(vector: Vector): Vector {
        return new Vector(this.x + vector.x, this.y + vector.y);
    }
    equals(vector: Vector): boolean {
        return (this.x === vector.x) && (this.y === vector.y);
    }
    static from(val: Coord){
        return new Vector(val.x, val.y);
    }
    toString(): string {
        return "(" + this.x + ", " + this.y + ")";
    }
    clone(): Vector {
        return new Vector(this.x,this.y);
    }
}