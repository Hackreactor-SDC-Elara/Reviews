const {Reviews, Char, CharReview} = require('../db/schema.js');

module.exports = {
  getMetas : async (req,res) => {
    var targetProdId = req.query.product_id;
    var outgoingData = {
      product_id: targetProdId
    };
     await Reviews.aggregate([
      {
        $project: {
          product_id: 1,
          rating: 1
        }
      },
      {
        $match: {
          'product_id': targetProdId
        }
      },
      {
        $group: {
          _id: null,
          5: {
            $sum: {
              $cond: [{$eq : ['$rating', 5]}, 1, 0]
            }
          },
          4: {
            $sum: {
              $cond: [{$eq : ['$rating', 4]}, 1, 0]
            }
          },
          3: {
            $sum: {
              $cond: [{$eq : ['$rating', 3]}, 1, 0]
            }
          },
          2: {
            $sum: {
              $cond: [{$eq : ['$rating', 2]}, 1, 0]
            }
          },
          1: {
            $sum: {
              $cond: [{$eq : ['$rating', 1]}, 1, 0]
            }
          }
        }
      }
      ])
      .then((results) => {
        outgoingData.ratings = results;
        res.status(200).send(outgoingData);
      })
      .catch((err) => {
        console.log(err);
        res.send();
      })
  }

    // Reviews.aggregate([
    //   {
    //     $match: {
    //       product_id: targetProdId
    //     }
    //   },
    //   {
    //     $group: {
    //       _id: null,
    //       'true': {
    //         $sum: {
    //           $cond: [{$eq : ['$recommend', true]}, 1, 0]
    //         }
    //       },
    //       'false': {
    //         $sum: {
    //           $cond: [{$eq : ['$recommend', false]}, 1, 0]
    //         }
    //       }
    //     }
    //   }
    // ]).exec((error, result) => {
    //   console.log(result);
    // })

}