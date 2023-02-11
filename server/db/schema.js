const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewsSchema = new Schema({
  id: {type: Number, required: true, index: { unique: true }}, //review_id
  product_id: {type: Number, required: true},
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
  id : {type: Number, index: { unique: true }},
  product_id: {type: Number, required: true},
  name: {type: String, required: true}
})

const charReviewSchema = new Schema({
  id : {type: Number, index: { unique: true }},
  characteristic_id: {type: Number, required: true},
  review_id: {type: Number, required: true},
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