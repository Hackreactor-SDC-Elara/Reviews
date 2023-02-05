const {Reviews, Char, CharReview, Results} = require('../db/schema.js');
const mongoose = require('mongoose');
const index = require('../../server/index.js');
// const resultSchema = new mongoose.Schema({
//   //intentionally empty;
//   });
// const Results = mongoose.model('Results', resultSchema, 'Results');
module.exports = {
  getReviews: async (req, res) => {
    if (Object.keys(req.params).length === 0) {
      var targetProdId = req.query.product_id;
      var sortOption = req.query.sort || 'helpful';
      var sortField = 'helpfulness';
      var page = req.query.page || 1;
      var count = parseInt(req.query.count) || 5;
    } else {
      var targetProdId = req.params.product_id;
      var sortOption = req.params.sort || 'helpful'; //bypassing relevant option
      var sortField = 'helpfulness';
      var page = req.params.page || 1;
      var count = parseInt(req.params.count) || 5;
    }
    if (targetProdId === undefined) {
      res.status(400).send();
      return;
    }
    var outgoingData = {
      product_id: targetProdId
    };
    if (sortOption === 'newest') {
      sortField = 'date';
    }
    await index.db.collection('Results').find({'_id': targetProdId}).sort({[sortField] : -1}).limit(count).toArray()
      .then((result) => {
        result = result[0];
        outgoingData.results = result.results;
        res.status(200).send(outgoingData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send(err);
      })
  },

  postReviews: async (req, res) => {
    console.log(req.body);
    var targetProdId = req.body.product_id;
    if (targetProdId === undefined) { //empty product_id
      res.status(400).send();
      return;
    }
    if (!parseInt(targetProdId)) { //invalid product_id
      res.status(500).send();
      return;
    }
    var incomingData = {
      id : '',
      product_id: targetProdId,
      rating: req.body.rating,
      date: new Date(),
      summary: req.body.summary,
      body: req.body.body,
      recommend: req.body.recommend,
      reported: false,
      reviewer_name: req.body.name,
      reviewer_email: req.body.email,
      response: null,
      helpfulness: 0,
      photos: req.body.photos
    };
    var tempChar = req.body.characteristics;
    await index.db.collection('reviews').find({}).sort({id : -1}).limit(1).toArray()
      .then((result) => {
        var count = result[0].id;
        // let count_time = Date.now();
        // console.log('countDocuments: ',(count_time - start)/1000);
        count++;
        incomingData.id = count;
      })
      .catch((err) => {
        console.log(err);
      });
    await index.db.collection('reviews').insertOne(incomingData)
      .then(() => {
        // let insert_review_time = Date.now();
        // console.log('reviews insertion: ',(insert_review_time - start)/1000);
        delete incomingData.product_id;
      })
      .catch((err) => {
        console.log(err);
      });
    var bulkStorage = [];
    var grabNameAndInsert = async function (incomingId) {
      await index.db.collection('chars').find({'id': incomingId}).toArray()
        .then((result) => {
          var characteristics = {
            id: incomingId,
            name: result[0].name,
            value: tempChar[incomingId]
          };
          var updateOne = {updateOne : {filter: {'_id' : targetProdId}, update: {$push: {result: characteristics}}}};
          bulkStorage.push(updateOne);
        })
        .catch((err) => {
          console.log(err);
        })
    };
    for (const charId in tempChar) {
      await grabNameAndInsert(charId);
      // let grabName = Date.now();
      // console.log('grabbing names: ', (grabName - start)/1000);
    }
    await index.db.collection('Characteristics').bulkWrite(bulkStorage);
      // let bulkWriting = Date.now();
      // console.log('bulkWrite names: ', (bulkWriting - start)/1000);
    await index.db.collection('Results').updateOne({'_id' : targetProdId}, {$push: {results: incomingData}})
      .then(() => {
        // let resultsInsert = Date.now();
        // console.log('Results insertion: ', (resultsInsert - start)/1000);
        res.status(201).send('Review Posted');
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send(err);
      })
  },

  updateHelpfulness: async (req, res) => {
    if (Object.keys(req.params).length === 0) {
      var targetReviewId = req.query.review_id;
    } else {
      var targetReviewId = req.params.review_id;
    }
    if (targetReviewId === undefined) {
      res.status(400).send();
      return;
    }
    targetReviewId = parseInt(targetReviewId);
    if (!targetReviewId) {
      res.status(500).send();
      return;
    }
    var targetProdId = '';
    //find product_id to update Results
    await index.db.collection('reviews').find({'id': targetReviewId}).toArray()
      .then((result) => {
        var targetProdId = result[0].product_id;
        index.db.collection('Results').updateOne(
          {
            '_id': targetProdId
          }, {
            $inc: {
              'results.$[element].helpfulness': 1
            }
          }, {
            arrayFilters: [{
              'element.id': targetReviewId
            }]
          })
      })
      .catch((err) => {
        console.log(err);
      })
    await index.db.collection('reviews').updateOne({ 'id': targetReviewId}, {$inc: {helpfulness: 1}})
      .then((result) => {
        res.status(204).send('Helpfulness Updated');
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send(err);
      })
  },

  reportReview: async (req, res) => {
    if (Object.keys(req.params).length === 0) {
      var targetReviewId = req.query.review_id;
    } else {
      var targetReviewId = req.params.review_id;
    }
    if (targetReviewId === undefined) {
      res.status(400).send();
      return;
    }
    targetReviewId = parseInt(targetReviewId);
    if (!targetReviewId) {
      res.status(500).send();
      return;
    }
    var targetProdId = '';
    //find product_id to update Results
    await index.db.collection('reviews').find({'id': parseInt(targetReviewId)}).toArray()
      .then((result) => {
        var targetProdId = result[0].product_id;
        return index.db.collection('Results').updateOne({
          '_id': targetProdId
        }, {
          $set: {
            'results.$[element].reported' : true
          }
        }, {
          arrayFilters: [{
            'element.id': targetReviewId
          }]
        })
      })
      .then((result) => {
        // console.log(result);
      })
      .catch((err) => {
        console.log(err);
      })
    await index.db.collection('reviews').updateOne({
      'id': targetReviewId
    }, {
      $set: {
        'reported' : true
      }
    })
      .then((result) => {
        console.log('Review reported');
        res.status(204).send();
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send(err);
      })
  }
}