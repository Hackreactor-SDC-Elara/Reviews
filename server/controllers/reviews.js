const {Reviews, ReviewsMeta, Results} = require('./schema.js');

module.exports = {
  getReviews: (req, res) => {
    var product_id = req.params.product_id;
    var sortOption = req.params.sort;
    var page = req.params.page;
    var count = req.params.count;
  }
}