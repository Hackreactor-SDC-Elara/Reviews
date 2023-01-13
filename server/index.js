const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.listen(port, () => {
  console.log(`app listening to http://localhost:${port}`)
});

app.get('/', (req, res) => {
  res.send('SDC TESTING')
});

module.exports.app = app;