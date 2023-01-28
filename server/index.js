const express = require('express');
const app = express();
const mongoose = require('moongoose');
const port = 3000;

app.use(express.json());
app.listen(port, () => {
  console.log(`app listening to http://localhost:${port}`)
});

mongoose
  .connect('mongodb://localhost/SDC', {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log('Connected to MongoDB...');
  })
  .catch((err) => {
    console.log(err);
  });

app.get('/', (req, res) => {
  res.send('SDC TESTING')
});

module.exports.app = app;