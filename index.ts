import runServer from './src/server';
import info from './src/info'
import start from './src/start';
import end from './src/end';
import move from './src/move';
runServer({
  info: info,
  start: start,
  move: move,
  end: end
});
