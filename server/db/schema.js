const mongoose = require('mongoose');
const { Schema } = mongoose;
var url = 'mongodb://localhost/SDC';
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.log(err, 'MongoDB connection error');
  });

const reviewsSchema = new Schema({
  id: {type: Number, required: true}, //review_id
  product_id: {type: Number, required: true},
  rating: {type: Number, required: true},
  date: {type: Number, required:true},
  summary: {type: String, required:true},
  body: {type: String, required:true},
  recommend: {type: Boolean, required: true},
  reported: {type: Boolean, required: true},
  reviewer_name: {type: String, required:true},
  reviewer_email: {type: String, required:true},
  response: {type:String},
  helpfulness: {type: Number, required:true},
  photos: [
    // review_id: {type: Number, required: true},
    // id: {type: String, index: true}, //photo_id
    // url: {type: String}
  ],
  characteristics: [
    // id: {type: Number, required:true},
    // characteristic_id: {type: Number, required:true},
    // review_id: {type: Number, required:true},
    // value: {type: Number, required:true}
  ]
});

const resultSchema = new Schema({
  product_id: {type: Number, required: true},
  result: []
 });

const Reviews = mongoose.model('Reviews', reviewsSchema);
// const ReviewsMeta = mongoose.model('ReviewsMeta', reviewsMetaSchema);
const Results = mongoose.model('Results', resultSchema);

module.exports = {Reviews, Results};