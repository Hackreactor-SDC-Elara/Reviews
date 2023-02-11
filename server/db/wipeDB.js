const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    mongoose.connection.db.dropDatabase(function(err, result) {
      if (err) {
        console.log('Database drop failed', err);
      } else {
        mongoose.connection.close();
      }
    })
  });