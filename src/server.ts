import express, { Request, Response, NextFunction } from "express"
import { Shared } from "./persistence/shared";
const persistent = new Map<string, Shared>();
export interface BattlesnakeHandlers {
  info: Function;
  start: Function;
  move: Function;
  end: Function;
}

export default function runServer(handlers: BattlesnakeHandlers) {
  const app = express();
  app.use(express.json());

  app.get("/", (req: Request, res: Response) => {
    res.send(handlers.info());
  });

  app.post("/start", (req: Request, res: Response) => {
    handlers.start(req.body,persistent);
    res.send("ok");
  });

  app.post("/move", (req: Request, res: Response) => {
    res.send(handlers.move(req.body,persistent.get(req.body.game.id)));
  });

  app.post("/end", (req: Request, res: Response) => {
    handlers.end(req.body,persistent);
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
