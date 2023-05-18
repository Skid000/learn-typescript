import { Population } from './genetic_algo/population';
import { Shared } from './persistence/shared';
import { GameState } from './types';
export function start(gameState: GameState, sharedMap: Map<string, Shared>, pop: Population): void {
  sharedMap.set(gameState.game.id, new Shared(pop.getNextMember()));
  console.log("Game started!");
}