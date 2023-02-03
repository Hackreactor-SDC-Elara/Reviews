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
  id: {type: String, required: true, index: { unique: true }}, //review_id
  product_id: {type: String, required: true},
  rating: {type: Number, required: true},
  date: {type: Date, required:true},
  summary: {type: String, required:true},
  body: {type: String, required:true},
  recommend: {type: Boolean, required: true},
  reported: {type: Boolean, required: true},
  reviewer_name: {type: String, required:true},
  reviewer_email: {type: String, required:true},
  response: {type:String},
  helpfulness: {type: Number, required:true},
  photos: []
});

const charSchema = new Schema({
  id : {type: String, index: { unique: true }},
  product_id: {type: String, required: true},
  name: {type: String, required: true}
})

const charReviewSchema = new Schema({
  id : {type: String, index: { unique: true }},
  characteristic_id: {type: String, required: true},
  review_id: {type: String, required: true},
  value: {type: Number, required: true}
})

const resultSchema = new Schema({
//intentionally empty;
});

const Reviews = mongoose.model('Reviews', reviewsSchema);
const Char = mongoose.model('Char', charSchema);
const CharReview = mongoose.model('CharReview', charReviewSchema);
const Results = mongoose.model('Results', resultSchema, 'Results');

module.exports = {Reviews, Char, CharReview, Results};