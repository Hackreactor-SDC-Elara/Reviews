const express = require('express');
const cluster = require('cluster');
const app = express();
const os = require('os');
const numCpu = os.cpus().length;

const { MongoClient } = require('mongodb');
const port = 3000;
const routes = require('./routes.js');

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

async function main() {
  // Use connect method to connect to the server
  await client.connect();
  const db = client.db('SDC2');
  module.exports.db = db;
  // the following code examples can be pasted here...

  return 'done.';
}

main()
  .then(() => {
  })
  .catch(console.error)

app.use(express.json());
// app.listen(port, () => {
//   console.log(`app listening to http://localhost:${port}`)
// });

app.use(routes);

app.get('/test', (req, res) => {
  res.status(200).send('SDC TESTING')
});

if (cluster.isMaster) {
  for (var i = 0; i < numCpu; i++) {
    cluster.fork();
  }
} else {
  app.listen(port, () => {
    console.log(`server pid: ${process.pid} listening to http://localhost:${port}`)
  });
}

module.exports.app = app;
