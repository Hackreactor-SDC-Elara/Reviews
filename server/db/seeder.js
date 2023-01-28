const {Reviews, Results} = require('./schema.js');
const charReviewsPath = '/Users/hyoon/Workspace/rpp2207/SDC/Reviews/rawData/characteristic_reviews.csv';
const characteristicsPath = '/Users/hyoon/Workspace/rpp2207/SDC/Reviews/rawData/characteristics.csv';
const reviewPhotosPath = '/Users/hyoon/Workspace/rpp2207/SDC/Reviews/rawData/reviews_photos.csv';
const reviewsPath = '/Users/hyoon/Workspace/rpp2207/SDC/Reviews/rawData/reviews.csv';
const productPath = '/Users/hyoon/Workspace/rpp2207/SDC/Reviews/rawData/product.csv';

const csv = require('csv-parser');
const fs = require('fs');

async function seedResults() {
  return new Promise(function(resolve, reject) {
    const stream = fs.createReadStream(productPath).pipe(csv());
    var counter = 0;
    var tempStroage = [];
      stream.on('data', (data) => {
          counter++;
          data.product_id = data.id;
          delete data.id;
          tempStroage.push(data);
          if (counter % 50000 === 0) {
            stream.pause();
            Results.insertMany(tempStroage);
            console.log(counter + ' lines of Result seeded');
            tempStroage = [];
            stream.resume();
          }
      })
      .on('end', () => {
        if (tempStroage.length) {
          stream.pause();
          Results.insertMany(tempStroage);
          stream.resume();
        }
        console.log('Result Seeding Done');
        resolve();
      })
      .on('error', () => {
        console.log('Result Seeding Failed');
        reject();
      });
  })
};

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

async function seedCharReviews() {
  return new Promise(function(resolve, reject) {
    const stream = fs.createReadStream(charReviewsPath).pipe(csv());
    var counter = 0;
    var tempStroage = [];
    stream.on('data', (data) => {
      counter++;
      var targetReviewId = data.review_id;
      delete data.review_id;
      delete data.id;
      data.name = '';
      //id,characteristic_id,review_id,value
      var updateOne = {updateOne : {filter: {id : targetReviewId}, update: {$push: {characteristics : data}}}};
      tempStroage.push(updateOne);
      if (counter % 10000 === 0) {
        stream.pause();
        Reviews.bulkWrite(tempStroage);
        console.log(counter + ' lines of Characteristics Reivews seeded');
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
      var targetProdId = data.product_id;
      var targetCharId = data.id;
      //Charcteristic Reviews have duplicate characteristic_id, hence using updateMany
      //id,product_id,name
      var updateMany = {updateMany : {
        filter: {'product_id' : targetProdId},
        update: {$set: {'characteristics.$[object].name' : data.name}},
        arrayFilters: [{'object.characteristic_id' : targetCharId}]
      }};
      tempStroage.push(updateMany);
      if (counter % 10000 === 0) {
        stream.pause();
        Reviews.bulkWrite(tempStroage);
        console.log(counter + ' lines of Characteristics Reivews seeded');
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
      console.log('Characteristics Reivews Seeding Done');
      resolve();
    })
    .on('error', () => {
      console.log('Characteristics Reivews Seeding Failed');
      reject();
    });
  })
};

async function seedingData () {
  await seedReviews();
  await seedPhotos();
  await seedCharReviews();
  await seedCharacteristics();
};

// seedingData();
seedCharReviews();

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