



// Joining Characteristics and Characteristics Review
[
  {
    '$lookup': {
      'from': 'chars', 
      'localField': 'characteristic_id', 
      'foreignField': 'id', 
      'as': 'fromChars'
    }
  }, {
    '$replaceRoot': {
      'newRoot': {
        '$mergeObjects': [
          {
            '$arrayElemAt': [
              '$fromChars', 0
            ]
          }, '$$ROOT'
        ]
      }
    }
  }, {
    '$project': {
      'review_id': 1, 
      'product_id': 1, 
      'name': 1, 
      'value': 1
    }
  }
]



[
  {
    '$match': {
      '_id': '8578'
    }
  }, {
    '$unwind': {
      'path': '$entries'
    }
  }, {
    '$group': {
      '_id': null, 
      'false': {
        '$sum': {
          '$cond': [
            {
              '$eq': [
                '$entries.recommend', true
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
                '$entries.recommend', false
              ]
            }, 1, 0
          ]
        }
      }
    }
  }
]


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