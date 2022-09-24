import { ScoreFunction } from "../types";
import { GridNode } from "./GridNode";

export class BinaryHeap {
    public scoreFunction: ScoreFunction;
    public content: GridNode[];
    constructor(scoreFunction: ScoreFunction) {
        this.scoreFunction = scoreFunction;
        this.content = [];
    }
    push(element: GridNode): void {
        this.content.push(element);
        this.sinkDown(this.content.length - 1);
    }
    pop(): GridNode {
        let result: GridNode = this.content[0], end: any = this.content.pop();
        if (this.content.length > 0) {
            this.content[0] = end;
            this.bubbleUp(0);
        }
        return result;
    }
    remove(node: GridNode): void {
        var i: number = this.content.indexOf(node);
        var end: any = this.content.pop();
        if (i !== this.content.length - 1) {
            this.content[i] = end;
            if (this.scoreFunction(end) < this.scoreFunction(node)) {
                this.sinkDown(i)
            } else {
                this.bubbleUp(i)
            }
        }
    }
    size(): number {
        return this.content.length;
    }
    rescoreElement(node: GridNode): void {
        this.sinkDown(this.content.indexOf(node));
    }
    sinkDown(n: number) {
        let element: GridNode = this.content[n];
        while (n > 0) {
            let parentN: number = ((n + 1) >> 1) - 1,
                parent: GridNode = this.content[parentN];
            if (this.scoreFunction(element) < this.scoreFunction(parent)) {
                this.content[parentN] = element;
                this.content[n] = parent;
                n = parentN;
            } else break;
        }
    }
    bubbleUp(n: number) {
        let length: number = this.content.length
            , element: GridNode = this.content[n]
            , elemScore: number = this.scoreFunction(element);
        while (!0) {
            let child2N: number = (n + 1) << 1,
                child1N: number = child2N - 1,
                swap: number | null = null;
            var child1Score: number = 0;
            if (child1N < length) {
                var child1 = this.content[child1N];
                child1Score = this.scoreFunction(child1);
                if (child1Score < elemScore) {
                    swap = child1N
                }
            }
            if (child2N < length) {
                var child2 = this.content[child2N];
                var child2Score = this.scoreFunction(child2);
                if (child2Score < (swap === null ? elemScore : child1Score)) {
                    swap = child2N
                }
            }
            if (swap !== null) {
                this.content[n] = this.content[swap];
                this.content[swap] = element;
                n = swap
            } else break;
        }
    }
}