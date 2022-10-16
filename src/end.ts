import { GameState } from './types';
export default function end(gameState: GameState): void {
    console.log(`Game ended at ${gameState.turn}!`);
}