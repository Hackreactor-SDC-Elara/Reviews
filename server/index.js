const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const port = 5050;
const routes = require('./routes.js');

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db('SDC2');
  module.exports.db = db;
  // the following code examples can be pasted here...

  return 'done.';
}

main()
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(console.error)

app.use(express.json());
app.listen(port, () => {
  console.log(`app listening to http://localhost:${port}`)
});

app.use(routes);

app.get('/test', (req, res) => {
  res.status(200).send('SDC TESTING')
});

module.exports.app = app;
