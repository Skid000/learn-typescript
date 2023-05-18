import { writeFileSync } from "fs";
import { MemberParams } from "./types";
import { GameState } from "../types";
function random(): number {
    return Math.random() * 2 - 1;
} function random2(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
export class Population {
    private size: number;
    private generations: number;
    private turns: number;
    private len: number;
    private mutationRate: number;
    private elitism: number;
    private popMembers: Member[];
    private curPopIndex: number;
    private generation: number;
    constructor(size: number, generations: number, turns: number, len: number, mutationRate: number, elitism: number) {
        this.size = size, this.generations = generations, this.turns = turns, this.len = len, this.mutationRate = mutationRate, this.elitism = elitism, this.curPopIndex = this.generation = 0;
        this.popMembers = [];
        for (let i = 0; i < this.size; i++) this.popMembers.push(new Member());
    }
    score(member: Member | undefined, turns: number, length: number,gameState: GameState) {
        if(member == undefined) return;
        member.fitness = (turns * length) / (this.turns * this.len);
        switch(!0){
            case gameState.board.snakes[0].health == 0:
                member.fitness++;
                break;
        }
    }
    getNextMember(): Member {
        if (this.curPopIndex == this.size) {
            this.curPopIndex = 0;
            this.generation++;
            this.popMembers.sort((a, b) => b.fitness - a.fitness);
            writeFileSync(`./gen_${this.generation - 1}.json`, JSON.stringify(this.popMembers), 'utf-8');
            console.log(`Started new generation: ${this.generation}\n Best score from previous generation: ${this.popMembers[0].fitness}`);
            this.mate();
        }
        let mem = this.popMembers[this.curPopIndex];
        this.curPopIndex++;
        return mem;
    }
    private mate() {
        let pool = this.matingPool();
        for (let i = 0; i < this.size; i++) {
            if (i < this.elitism) {
                continue;
            }
            let a = pool[random2(0, pool.length)],
                b = pool[random2(0, pool.length)],
                child = a.repro(b);
            child.mutate(this.mutationRate);
            this.popMembers[i] = child;
        }
    }
    private matingPool() {
        let pool: Member[] = [];
        for(let i = 0; i < this.popMembers.length; i++){
            let e = this.popMembers[i];
            if(i > Math.floor(this.popMembers.length * 0.7)) continue;
            let f = Math.floor(e.fitness * 100);
            while (f--) {
                pool.push(e);
            }
        }
        return pool;
    }
}
export class Member {
    public fitness: number;
    public param: MemberParams;
    constructor() {
        this.fitness = 0;
        this.param = {
            a: random(),
            b: random(),
            c: random(),
            d: random()
        }
    }
    mutate(rate: number): void {
        for (let i in this.param) {
            if (Math.random() > rate) continue;
            this.param[i] = random();
        }
    }
    repro(partner: Member): Member {
        let child = new Member(),
            mid = random2(0, 4), i = 0;
        for (let t in child.param) {
            child.param[t] = (this.param[t] + partner.param[t]) / 2
        }
        return child;
    }
};