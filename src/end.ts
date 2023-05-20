import { Population } from './genetic_algo/population';
import { Shared } from './persistence/shared';
import { GameState } from './types';
export function end(gameState: GameState, sharedMap: Map<string, Shared>,pop: Population): void {
    pop.score(sharedMap.get(gameState.game.id)?.member,gameState.turn,gameState.you.length,gameState);
    console.log(`Game ended at ${gameState.turn}!\nWith Fitness of ${sharedMap.get(gameState.game.id)?.member.fitness}\n`);
    sharedMap.delete(gameState.game.id);
}