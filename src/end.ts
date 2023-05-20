import { Population } from './genetic_algo/population';
import { Shared } from './persistence/shared';
import { GameState } from './types';
export function end(gameState: GameState, sharedMap: Map<string, Shared>,pop: Population): void {
    let mem = sharedMap.get(gameState.game.id)?.member;
    pop.score(mem,gameState.turn,gameState.you.length,gameState);
    console.log(`=========\nGame ended at ${gameState.turn}!\nWith Fitness of ${mem?.fitness}\nParams: ${mem == undefined || Object.keys(mem.param).map(e=>`${e == 'a' ? '' : '\t'}${e}: ${mem?.param[e]}`).join('\n')}\n=========`);
    sharedMap.delete(gameState.game.id);
}