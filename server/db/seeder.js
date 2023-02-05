const {Reviews, Char, CharReview} = require('./schema.js');
const index = require('../../server/index.js');
const mongoose = require('mongoose');
const charReviewsPath = '/Users/hyoon/Workspace/rpp2207/SDC/Reviews/rawData/characteristic_reviews.csv';
const characteristicsPath = '/Users/hyoon/Workspace/rpp2207/SDC/Reviews/rawData/characteristics.csv';
const reviewPhotosPath = '/Users/hyoon/Workspace/rpp2207/SDC/Reviews/rawData/reviews_photos.csv';
const reviewsPath = '/Users/hyoon/Workspace/rpp2207/SDC/Reviews/rawData/reviews.csv';
const productPath = '/Users/hyoon/Workspace/rpp2207/SDC/Reviews/rawData/product.csv';

const csv = require('csv-parser');
const fs = require('fs');

async function seedReviews() {
  return new Promise(function(resolve, reject) {
    const stream = fs.createReadStream(reviewsPath).pipe(csv());
    var counter = 0;
    var tempStroage = [];
    stream.on('data', (data) => {
      counter++;
      var targetProductID = data.product_id;
      tempStroage.push(data);
      if (counter % 10000 === 0) {
        stream.pause();
        Reviews.insertMany(tempStroage);
        console.log(counter + ' lines of Reviews seeded');
        tempStroage = [];
        stream.resume();
      }
    })
    .on('end', () => {
      if (tempStroage.length) {
        stream.pause();
        Reviews.insertMany(tempStroage);
        stream.resume();
      }
      console.log('Review Seeding Done');
      resolve();
    })
    .on('error', () => {
      console.log('Review Seeding Failed');
      reject();
    });
  })
};

async function seedPhotos() {
  return new Promise(function(resolve, reject) {
    const stream = fs.createReadStream(reviewPhotosPath).pipe(csv());
    var counter = 0;
    var tempStroage = [];
    stream.on('data', (data) => {
      counter++;
      var targetReviewId = data.review_id;
      delete data.review_id;
      var updateOne = {updateOne : {filter: {id : targetReviewId}, update: {$push: {photos : data}}}};
      tempStroage.push(updateOne);
      if (counter % 10000 === 0) {
        stream.pause();
        Reviews.bulkWrite(tempStroage);
        console.log(counter + ' lines of Photos seeded');
        tempStroage = [];
        stream.resume();
      }
    })
    .on('end', () => {
      if (tempStroage.length) {
        stream.pause();
        Reviews.bulkWrite(tempStroage);
        stream.resume();
      }
      console.log('Photos Seeding Done');
      resolve();
    })
    .on('error', () => {
      console.log('Photos Seeding Failed');
      reject();
    });
  })
};

async function seedResults() {
  return new Promise(function(resolve, reject) {
    Reviews.aggregate([
      {
        '$group': {
          '_id': '$product_id',
          'results': {
            '$push': {
              'id': '$id',
              'rating': '$rating',
              'date': '$date',
              'summary': '$summary',
              'body': '$body',
              'recommend': '$recommend',
              'reported': '$reported',
              'reviewer_name': '$reviewer_name',
              'reviewer_email': '$reviewer_email',
              'response': '$response',
              'helpfulness': '$helpfulness',
              'photos': '$photos'
            }
          }
        }
      }, {
        '$out': 'Results'
      }
    ])
    .then((result) => {
      console.log('Result Grouped by Product ID');
      resolve();
    })
    .catch((err) => {
      console.log('Result Groupping Failed');
      reject();
    })
  })
};

async function seedCharReviews() {
  return new Promise(function(resolve, reject) {
    const stream = fs.createReadStream(charReviewsPath).pipe(csv());
    var counter = 0;
    var tempStroage = [];
    stream.on('data', (data) => {
      counter++;
      //id,characteristic_id,review_id,value
      tempStroage.push(data);
      if (counter % 10000 === 0) {
        stream.pause();
        CharReview.insertMany(tempStroage);
        console.log(counter + ' lines of Characteristics Reivews seeded');
        tempStroage = [];
        stream.resume();
      }
    })
    .on('end', () => {
      if (tempStroage.length) {
        stream.pause();
        CharReview.insertMany(tempStroage);
        stream.resume();
      }
      console.log('Characteristics Reivews Seeding Done');
      resolve();
    })
    .on('error', () => {
      console.log('Characteristics Reivews Seeding Failed');
      reject();
    });
  })
};

async function seedCharacteristics() {
  return new Promise(function(resolve, reject) {
    const stream = fs.createReadStream(characteristicsPath).pipe(csv());
    var counter = 0;
    var tempStroage = [];
    stream.on('data', (data) => {
      counter++;
      //id,product_id,name
      tempStroage.push(data);
      if (counter % 10000 === 0) {
        stream.pause();
        Char.insertMany(tempStroage);
        console.log(counter + ' lines of Characteristics seeded');
        tempStroage = [];
        stream.resume();
      }
    })
    .on('end', () => {
      if (tempStroage.length) {
        stream.pause();
        Char.insertMany(tempStroage);
        stream.resume();
      }
      index.db.collection('chars').createIndex({id: 1},{unique: true});
      console.log('Characteristics Seeding Done');
      resolve();
    })
    .on('error', () => {
      console.log('Characteristics Seeding Failed');
      reject();
    });
  })
};

async function seedMetaCharData() {
  return new Promise(function(resolve, reject) {
    CharReview.aggregate([
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
        '$group': {
          '_id': '$product_id',
          'result': {
            '$push': {
              'id': '$characteristic_id',
              'name': '$name',
              'value': '$value'
            }
          }
        }
      }, {
        '$out': 'Characteristics'
      }
    ])
    .then(() => {
      console.log('Characteristics DB Collection Created');
      resolve();
    })
    .catch((err) => {
      console.log('Characteristics DB Collection Creation Failed', err);
      reject();
    })
  });

};

async function seedingData () {
  await seedReviews();
  await seedPhotos();
  await seedResults();
  await seedCharReviews();
  await seedCharacteristics();
  await seedMetaCharData();
};

seedingData();


//Stress Test (local)
//Httperf, K6, Artillery

//Stress Test (deployed)
//Loader.io, Flood.io

//Metrics that describe system performance
//Response Time (Latency) - how fast does my API respone
//Goal: < 2000 ms under load

//Throughput - how many request can you precess per second (RPS/QPS/RPM)
//Goal: < 100 RPS on EC2

//Error rate: how often does a response generate an error?
//Goal: < 1% under load

//Metric Collection & Visualization
//Logging
//Counter and Time Metrics
//New Relic, statsD + Grafana, ELK stack