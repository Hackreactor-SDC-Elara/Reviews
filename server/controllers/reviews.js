const {Reviews, ReviewsMeta, Results} = require('./schema.js');

module.exports = {
  getReviews: async (req, res) => {
    var product_id = req.params.product_id;
    var sortOption = req.params.sort || 'helpful';
    var sortField = 'helpfulness';
    var page = req.params.page || 1;
    var count = req.params.count || 5;
    if (sortOption === 'newest') {
      sortField = 'date';
    }
    await Reviews.find({'product_id': product_id}).sort({sortField: -1}).limit(count)
      .then((result) => {
        res.sendStatus(200).send(result);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(500).send();
      })
  },

  postReviews: async (req, res) => {
    var product_id = req.params.product_id;
    var body = req.body;
    await Reviews.create(body)
      .then(() => {
        res.sendStatus(201).send();
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(500).send();
      })
  },

  updateHelpfulness: async (req, res) => {
    var review_id = req.params.review_id;
    var newHelpfulnessCount = req.body;
    await Reviews.update({ 'review_id': review_id}, {helpfulness: newHelpfulnessCount})
      .then((result) => {
        res.sendStatus(204).send();
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(500).send();
      })
  },

  reportReview: async (req, res) => {
    var review_id = req.params.review_id;
    var isReported = req.body;
    await Reviews.update({ 'review_id': review_id}, {reported: isReported})
      .then((result) => {
        res.sendStatus(204).send();
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(500).send();
      })
  }
}