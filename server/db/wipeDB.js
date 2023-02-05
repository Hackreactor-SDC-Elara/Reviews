const mongoose = require('mongoose');
var url = 'mongodb://localhost/SDC2';
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    mongoose.connection.db.dropDatabase(function(err, result) {
      if (err) {
        console.log('Database drop failed', err);
      } else {
        mongoose.connection.close();
      }
    })
  });