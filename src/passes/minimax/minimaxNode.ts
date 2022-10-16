import { Board } from "../../types";
import { validMoves } from "../../util/Util";
import { Vector } from "../../util/vector";

export class minimaxNode {
    private parent: minimaxNode;
    private populatedBoard: number[][];
    private score: number;
    private board: Board;
    private movingId: string;
    private isEnd: boolean;
    constructor(parent: minimaxNode, populatedBoard: number[][], board: Board, movingId: string) {
        this.parent = parent;
        this.populatedBoard = populatedBoard;
        this.score = 0;
        this.board = board;
        this.movingId = movingId;
        this.isEnd = false;
    }
    backProp(): minimaxNode {
        return this.parent;
    }
    createChildren(): minimaxNode[] {
        let snakeValidMoves: Vector[] = validMoves(this.populatedBoard, this.board, this.movingId),
            children: minimaxNode[] = [];
        if(!snakeValidMoves.length){
            this.isEnd = true;
            this.setScore(-Infinity);
            return children;
        }
        for(let i = 0; i < snakeValidMoves.length; i++){
            
        }
        return children;
    }
    isTerminal(): boolean {
        return this.isEnd;
    }
    setScore(score: number) {
        this.score = score;
    }
}