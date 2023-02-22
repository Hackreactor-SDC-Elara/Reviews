const express = require('express');
const cluster = require('cluster');
const app = express();
const os = require('os');
const numCpu = os.cpus().length;
require('dotenv').config();

const { MongoClient } = require('mongodb');
const port = process.env.PORT;
const routes = require('./routes.js');
const client = new MongoClient(process.env.MONGODB_URI);

async function main() {
  await client.connect();
  const db = client.db(process.env.DB_NAME);
  module.exports.db = db;
    return 'done.';
}

main()
  .then(() => {
    console.log('Mongo DB Connected');
  })
  .catch(console.error)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);
app.get('/test', (req, res) => {
  res.status(200).send('SDC TESTING')
});
app.get('/loaderio-53935c367ddba0bf80dee9adb95e969c', (req, res) => {
  res.status(200).send('loaderio-53935c367ddba0bf80dee9adb95e969c');
})
app.listen(port, () => {
  console.log(`server pid: ${process.pid} listening to http://localhost:${port}`)
});

// if (cluster.isMaster) {
//   for (var i = 0; i < numCpu; i++) {
//     cluster.fork();
//   }
// } else {
//   app.listen(port, () => {
//     console.log(`server pid: ${process.pid} listening to http://localhost:${port}`)
//   });
// }

module.exports.app = app;
