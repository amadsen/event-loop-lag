const EventEmitter = require('events').EventEmitter;
const lagger = new EventEmitter();

const NS_PER_SEC = 1e9;

const countTarget = process.argv[2] || 10000;
const interval = process.argv[3] || 200;

const count = () => {
  for (var i = 0; i < countTarget; i++) {
    if (i % Math.floor(countTarget / 10) === 0) {
      process.stdout.write(`${i} `);
    }
  }

  console.log('Done counting');  
}

const next = () => {
  const now = process.hrtime();
  setTimeout(() => {
    lagger.emit('measure-lag', interval * (NS_PER_SEC / 1000), now);
  }, interval);
  count();
};

lagger.on('measure-lag', (nanoseconds, previous) => {
  const time = process.hrtime(previous);
  const took = time[0] * NS_PER_SEC + time[1];
  console.log(
    `Scheduled log at ${nanoseconds} nanoseconds took ${took} nanoseconds`
  )
  console.log(`${took - nanoseconds} nanoseconds late`);

  next();
});

next();

