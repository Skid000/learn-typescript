import { type } from "os";
import { Vector } from "../util/vector";

export class Shared{
    public didEat: boolean;
    public foodVec:Vector;
    constructor(){
        this.didEat = false;
        this.foodVec = new Vector(-1,-1);
    }
    resetFood(){
        this.didEat = false;
        this.foodVec = new Vector(-1,-1);
    }
    setFood(vector:Vector){
        if(typeof vector.clone != 'function') console.log(vector);
        this.didEat = true;
        this.foodVec = vector.clone();
    }
}