const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork();

    worker.on('message', (msg) => {
      console.log(`Master received message from worker: ${msg}`);
    });

    worker.on('exit', (code, signal) => {
      console.log(`Worker ${worker.process.pid} exited with code ${code}`);
    });
  }

  cluster.on('fork', (worker) => {
    console.log(`Worker ${worker.process.pid} is now online`);
  });

  cluster.on('message', (worker, msg) => {
    console.log(
      `Master received message from worker ${worker.process.pid}: ${msg}`
    );
  });
} else {
  http
    .createServer((req, res) => {
      res.writeHead(200);
      res.end('Hello, World!\n');
    })
    .listen(8000);

  // Send a message to the master process
  process.send('Hello, Master!');
}
