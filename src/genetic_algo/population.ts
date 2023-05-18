import { MemberParams } from "./types";
function random(): number {
    return Math.random() * 2 - 1;
}
export class Population {
    private size: number;
    private generations: number;
    private turns: number;
    private len: number;
    constructor(size: number, generations: number, turns: number, len: number) {
        this.size = size, this.generations = generations, this.turns = turns, this.len = len;
    }
}
class Member {
    private fitness: number;
    private param: MemberParams;
    constructor() {
        this.fitness = 0;
        this.param = {
            a: random(),
            b: random(),
            c: random(),
            d: random()
        }
    }
};