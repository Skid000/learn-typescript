import express, { Request, Response, NextFunction } from "express"
import { Shared } from "./persistence/shared";
import { Population } from "./genetic_algo/population";
import { info } from "./info";
import { start } from "./start";
import config from "./genetic_algo/config.json"
import { move } from "./move";
import { end } from "./end";
const persistent = new Map<string, Shared>(),
  population = new Population(config.size, config.generations, config.turns, config.length, config.mutationRate, config.elitism);
  population.importGen('./gen_53.json');
export interface BattlesnakeHandlers {
  info: typeof info;
  start: typeof start;
  move: typeof move;
  end: typeof end;
}

export function runServer(handlers: BattlesnakeHandlers) {
  const app = express();
  app.use(express.json());

  app.get("/", (req: Request, res: Response) => {
    res.send(handlers.info());
  });

  app.post("/start", (req: Request, res: Response) => {
    handlers.start(req.body, persistent,population);
    res.send("ok");
  });

  app.post("/move", (req: Request, res: Response) => {
    res.send(handlers.move(req.body, persistent.get(req.body.game.id)));
  });

  app.post("/end", (req: Request, res: Response) => {
    handlers.end(req.body, persistent,population);
    res.send("ok");
  });

  app.use(function (req: Request, res: Response, next: NextFunction) {
    res.set("Server", "battlesnake/github/starter-snake-typescript");
    next();
  });

  const host = '0.0.0.0';
  const port = parseInt(process.env.PORT || '8000');

  app.listen(port, host, () => {
    console.log(`Running Battlesnake at http://${host}:${port}...`);
  });
}
