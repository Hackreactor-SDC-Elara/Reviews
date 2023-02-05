const express = require('express');
const app = express();
// const { MongoClient } = require('mongodb');
const port = 3000;
const routes = require('./routes.js');
const mongoose = require('mongoose');
var url = 'mongodb://localhost/SDC3';

// const url = 'mongodb://localhost:27017';
// const client = new MongoClient(url);

// async function main() {
//   // Use connect method to connect to the server
//   await client.connect();
//   console.log('Connected successfully to server');
//   const db = client.db('SDC');
//   module.exports.db = db;
//   // the following code examples can be pasted here...

//   return 'done.';
// }
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.log(err, 'MongoDB connection error');
  });
// main()
//   .then(() => {
//     console.log('MongoDB connected');
//   })
//   .catch(console.error)

app.use(express.json());
app.listen(port, () => {
  console.log(`app listening to http://localhost:${port}`)
});

app.use(routes);

app.get('/', (req, res) => {
  res.send('SDC TESTING')
});

module.exports.app = app;
// module.exports.db = db;