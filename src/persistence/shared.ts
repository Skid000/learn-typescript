import { type } from "os";
import { Vector } from "../util/vector";
import { Member } from "../genetic_algo/population";
export class Shared {
    public didEat: boolean;
    public foodVec: Vector;
    public member: Member;
    constructor(member: Member) {
        this.didEat = false;
        this.foodVec = new Vector(-1, -1);
        this.member = member;
    }
    resetFood() {
        this.didEat = false;
        this.foodVec = new Vector(-1, -1);
    }
    setFood(vector: Vector) {
        if (typeof vector.clone != 'function') console.log(vector);
        this.didEat = true;
        this.foodVec = vector.clone();
    }
}