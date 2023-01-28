const router = require('express').Router();
const controller = require('./controllers');

router.get('/reviews/', controller.reviews.getReviews)
router.get('/reviews/meta/', controller.reviewsMeta.getMetas)

router.post('/reviews', controller.reviews.postReviews)

router.put('/reviews/:review_id/helpful')
router.put('/reviews/:review_id/report')