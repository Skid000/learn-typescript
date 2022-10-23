import { Shared } from './persistence/shared';
import { GameState } from './types';
export default function start(gameState: GameState,sharedMap: Map<string,Shared>): void {
  sharedMap.set(gameState.game.id,new Shared());
  console.clear();
  console.log("Game started!");
}