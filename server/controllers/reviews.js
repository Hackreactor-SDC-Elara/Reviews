const {Reviews, Char, CharReview, Results} = require('../db/schema.js');
const mongoose = require('mongoose');
const index = require('../../server/index.js');
// const resultSchema = new mongoose.Schema({
//   //intentionally empty;
//   });
// const Results = mongoose.model('Results', resultSchema, 'Results');
module.exports = {
  getReviews: async (req, res) => {
    var targetProdId = parseInt(req.query.product_id);
    var sortOption = req.query.sort || 'helpful';
    var sortField = 'helpfulness';
    var page = req.query.page || 1;
    var count = req.query.count || 5;
    if (sortOption === 'newest') {
      sortField = 'date';
    }
    await index.db.collection('Results').find({'_id': targetProdId}).sort({[sortField] : -1}).limit(count).toArray()
      .then((result) => {
        result = result[0];
        result.product_id = result._id;
        result.result = result.result;
        delete result._id;
        res.status(200).send(result);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send(err);
      })
      // console.log(result);
      // res.send(result);
  },

  postReviews: async (req, res) => {
    var product_id = req.params.product_id;
    var body = req.body;
    await Reviews.insertOne(body)
      .then(() => {
        res.status(201).send('Review Posted');
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send(err);
      })
  },

  updateHelpfulness: async (req, res) => {
    var review_id = req.params.review_id;
    var newHelpfulnessCount = req.body;
    await Reviews.update({ 'review_id': review_id}, {helpfulness: newHelpfulnessCount})
      .then((result) => {
        res.status(204).send('Helpfulness Updated');
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send(err);
      })
  },

  reportReview: async (req, res) => {
    var review_id = req.params.review_id;
    var isReported = req.body;
    await Reviews.update({ 'review_id': review_id}, {reported: isReported})
      .then((result) => {
        res.status(204).send('Review Reported');
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send(err);
      })
  }
}