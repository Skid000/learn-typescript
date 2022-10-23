import { Shared } from './persistence/shared';
import { GameState } from './types';
export default function end(gameState: GameState, sharedMap: Map<string, Shared>): void {
    sharedMap.delete(gameState.game.id);
    console.log(`Game ended at ${gameState.turn}!`);
}