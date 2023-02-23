const {Reviews, Char, CharReview} = require('../db/schema.js');
const index = require('../../server/index.js');

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
    targetProdId = parseInt(targetProdId);
    var outgoingData = {
      product_id: targetProdId
    };
    if (sortOption === 'newest') {
      await index.db.collection('reviews').find({product_id: targetProdId}).sort({date: 1}).limit(count).toArray()
        .then((result) => {
          if (result.length === 0) {
            outgoingData.results = [];
            res.status(404).send([]);
          }
          outgoingData.results = result;
          res.status(200).send(outgoingData);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send();
        })
    } else {
      await index.db.collection('reviews').find({product_id: targetProdId}).sort({helpfulness: -1}).limit(count).toArray()
        .then((result) => {
          if (result.length === 0) {
            outgoingData.results = result;
            res.status(404).send(outgoingData);
          }
          outgoingData.results = result;
          res.status(200).send(outgoingData);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send();
        })
    }
  },

  postReviews: async (req, res) => {
    var targetProdId = req.body.product_id;
    targetProdId = parseInt(targetProdId);
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
      await grabNameAndInsert(parseInt(charId));
      // let grabName = Date.now();
      // console.log('grabbing names: ', (grabName - start)/1000);
    }
    await index.db.collection('Characteristics').bulkWrite(bulkStorage)
      .then(() => {
        console.log('Review Posted');
        res.status(201).send();
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
    await index.db.collection('reviews').updateOne({ 'id': targetReviewId}, {$inc: {helpfulness: 1}})
      .then((result) => {
        console.log('Helpfulness updated');
        res.status(204).send();
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send();
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