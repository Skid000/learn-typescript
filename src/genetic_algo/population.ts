import { PathLike, readFileSync, writeFileSync } from "fs";
import { MemberParams } from "./types";
import { GameState } from "../types";
import config from "./config.json";
function random(): number {
    return Math.random() - 0.5;
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
    importGen(path: PathLike) {
        let gen: Member[] = JSON.parse(readFileSync(path, 'utf-8'));
        if (/gen_[0-9]+\.json/.test(path.toString())) this.generation = parseInt(path.toString().replace(/\.\/gen_|\.json/g, "")) + 1;
        for (let i = 0; i < this.size; i++) {
            this.popMembers[i].param = gen[i].param;
        }
    }
    score(member: Member | undefined, turns: number, length: number, gameState: GameState) {
        if (member == undefined) return;
        member.fitness = (turns * length) / (this.turns * this.len);
        try {
            if (gameState.board.snakes[0].id == gameState.you.id) member.fitness++;
        } catch (err) {
            member.fitness++;
        }
    }
    getNextMember(): Member {
        if (this.curPopIndex == this.popMembers.length) {
            this.curPopIndex = 0;
            this.generation++;
            this.popMembers.sort((a, b) => b.fitness - a.fitness);
            let t = 0;
            this.popMembers.forEach(e => t += e.fitness);
            t /= this.popMembers.length;
            writeFileSync(`./gen_${this.generation - 1}.json`, JSON.stringify(this.popMembers), 'utf-8');
            console.log(`Started new generation: ${this.generation}\nBest score from previous generation: ${this.popMembers[0].fitness}\nAverage Score from previous generation: ${t}\nLowest Score from previous generation: ${this.popMembers.at(-1)?.fitness}`);
            this.mate();
        }
        let mem = this.popMembers[this.curPopIndex];
        this.curPopIndex++;
        return mem;
    }
    private mate() {
        let newChild = [];
        for(let i = 0; i < config.newChildren; i++) newChild.push(this.tournamentSelectChild());
        this.popMembers.splice(-newChild.length);
        for(let p of newChild) p != undefined && this.popMembers.push(p);
    }
    private tournamentSelectChild() {
        let a = null, b = null, indices = [];
        for(let i = 0; i < this.popMembers.length;i++) indices.push(i);
        for(let t = 0; t < config.ways;t++){
            let s = indices.slice(random2(0,indices.length),1)[0];
            if(a === null || s < a){
                b = a;
                a = s;
            }else if (b === null || s < b){
                b = s;
            }
        }
        if(a == null || b == null) return;
        let child = this.popMembers[a].repro(this.popMembers[b]);
        child.mutate(this.mutationRate);
        return child;
    }
    private matingPool() {
        let pool: Member[] = [];
        for (let i = 0; i < this.popMembers.length; i++) {
            let e = this.popMembers[i];
            if (i > Math.floor(this.popMembers.length * 0.25)) break;
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
            d: random(),
            e: random()
        }
        this.normalize();
    }
    normalize() {
        let g = 0;
        for (let i in this.param) g += this.param[i] ** 2
        let n = Math.sqrt(g);
        for (let i in this.param) this.param[i] /= n;
    }
    mutate(rate: number): void {
        for (let i in this.param) {
            if (Math.random() < rate) {
                this.param[i] += Math.random() * 0.4 - 0.2;
                break;
            };
        }
    }
    repro(partner: Member): Member {
        let child = new Member();
        for (let t in child.param) {
            child.param[t] = (this.fitness * this.param[t]) + (partner.fitness * partner.param[t])
        }
        child.normalize();
        return child;
    }
};