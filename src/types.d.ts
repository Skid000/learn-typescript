// API Types
// https://docs.battlesnake.com/api

import { GridNode } from "./pathfinding/GridNode";
import { Vector } from "./util/vector";

export interface Coord {
    x: number;
    y: number;
  }
  
  export interface Battlesnake {
    id: string;
    name: string;
    health: number;
    body: Coord[];
    head: Coord;
    length: number;
    latency: string;
    shout: string;
    customizations: Customizations;
  }
  export interface MiniMaxMove {
    move: Vector;
    score: number;
  }
  export interface moveDecision {
    moveResponse?: MoveResponse;
    valid: boolean;
    target?: Vector;
  }
  export interface Customizations {
    color: string;
    head: string;
    tail: string;
  }
  
  export interface Board {
    height: number;
    width: number;
    food: Coord[];
    hazards: Coord[];
    snakes: Battlesnake[];
  }
  
  export interface GameState {
    game: Game;
    turn: number;
    board: Board;
    you: Battlesnake;
  }
  
  export interface Game {
    id: string;
    ruleset: Ruleset;
    map: string;
    source: string;
    timeout: number;
  }
  
  export interface Ruleset {
    name: string;
    version: string;
    settings: RulesetSettings;
  }
  
  export interface RulesetSettings {
    foodSpawnChance: number;
    minimumFood: number;
    hazardDamagePerTurn: number;
  }
  
  // Response Types
  // https://docs.battlesnake.com/api
  
  export interface InfoResponse {
    apiversion: string;
    author?: string;
    color?: string;
    head?: string;
    tail?: string;
    version?: string;
  }
  
  export interface MoveResponse {
    move: string;
    shout?: string;
  }
  export interface GraphOption{
    diagonal?: boolean;
  }
  export interface SearchOption{
    heuristic?: Function;
    closest?: boolean;
  }
  export interface ScoreFunction {
    (node:GridNode): number;
  }
  