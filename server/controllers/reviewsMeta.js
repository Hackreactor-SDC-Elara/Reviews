const {Reviews, Char, CharReview, Results} = require('../db/schema.js');
const index = require('../../server/index.js');

module.exports = {
  getMetas : async (req,res) => {
    if (Object.keys(req.params).length === 0) {
      var targetProdId = req.query.product_id;
    } else {
      var targetProdId = req.params.product_id;
    }
    if (targetProdId === undefined) {
      res.status(400).send();
      return;
    }
    targetProdId = parseInt(targetProdId);
    var outgoingData = {
      product_id: targetProdId,
      ratings: {},
      recommended: {},
      characteristics: {}
    };
    var rating = await index.db.collection('Results').aggregate([
      {
        '$match': {
          '_id': targetProdId
        }
      }, {
        '$unwind': {
          'path': '$results'
        }
      }, {
        '$group': {
          '_id': null,
          '1': {
            '$sum': {
              '$cond': [
                {
                  '$eq': [
                    '$results.rating', 1
                  ]
                }, 1, 0
              ]
            }
          },
          '2': {
            '$sum': {
              '$cond': [
                {
                  '$eq': [
                    '$results.rating', 2
                  ]
                }, 1, 0
              ]
            }
          },
          '3': {
            '$sum': {
              '$cond': [
                {
                  '$eq': [
                    '$results.rating', 3
                  ]
                }, 1, 0
              ]
            }
          },
          '4': {
            '$sum': {
              '$cond': [
                {
                  '$eq': [
                    '$results.rating', 4
                  ]
                }, 1, 0
              ]
            }
          },
          '5': {
            '$sum': {
              '$cond': [
                {
                  '$eq': [
                    '$results.rating', 5
                  ]
                }, 1, 0
              ]
            }
          }
        }
      }
    ]).toArray();
    var recommendation = await index.db.collection('Results').aggregate([
      {
        '$match': {
          '_id': targetProdId
        }
      }, {
        '$unwind': {
          'path': '$results'
        }
      }, {
        '$group': {
          '_id': null,
          'false': {
            '$sum': {
              '$cond': [
                {
                  '$eq': [
                    '$results.recommend', false
                  ]
                }, 1, 0
              ]
            }
          },
          'true': {
            '$sum': {
              '$cond': [
                {
                  '$eq': [
                    '$results.recommend', true
                  ]
                }, 1, 0
              ]
            }
          }
        }
      }
    ]).toArray();
    var characteristic = await index.db.collection('Characteristics').aggregate([
      {
        '$match': {
          '_id': targetProdId
        }
      }, {
        '$unwind': {
          'path': '$result'
        }
      }, {
        '$group': {
          '_id': '$result.name',
          'result': {
            '$push': {
              'id': '$result.id'
            }
          },
          'value': {
            '$avg': '$result.value'
          }
        }
      }
    ]).toArray();

      Promise.all([rating, recommendation, characteristic])
      .then((results) => {
        var ratings = results[0][0];
        var recommended = results[1][0];
        var charTemp = results[2];
        var characteristics = {};
        var assignChar = function(charObj) {
          if (charObj._id === 'Size') {
            characteristics.Size = {};
            characteristics.Size.id = charObj.result[0].id;
            characteristics.Size.value = charObj.value;
          } else if (charObj._id === 'Length') {
            characteristics.Length = {};
            characteristics.Length.id = charObj.result[0].id;
            characteristics.Length.value = charObj.value;
          } else if (charObj._id === 'Comfort') {
            characteristics.Comfort = {};
            characteristics.Comfort.id = charObj.result[0].id;
            characteristics.Comfort.value = charObj.value;
          } else if (charObj._id === 'Fit') {
            characteristics.Fit = {};
            characteristics.Fit.id = charObj.result[0].id;
            characteristics.Fit.value = charObj.value;
          } else if (charObj._id === 'Width') {
            characteristics.Width = {};
            characteristics.Width.id = charObj.result[0].id;
            characteristics.Width.value = charObj.value;
          } else if (charObj._id === 'Quality') {
            characteristics.Quality = {};
            characteristics.Quality.id = charObj.result[0].id;
            characteristics.Quality.value = charObj.value;
          };
        };
        charTemp.forEach(obj => {assignChar(obj)});
        delete ratings._id;
        delete recommended._id;
        outgoingData.ratings = ratings;
        outgoingData.recommended = recommended;
        outgoingData.characteristics = characteristics;
        res.status(200).send(outgoingData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send();
      })
  }
}