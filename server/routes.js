const router = require('express').Router({ mergeParams: true });
const controller = require('./controllers');

router.get('/reviews', controller.reviews_revised.getReviews)
router.get('/reviews/meta/', controller.reviewsMeta_revised.getMetas)

router.post('/reviews', controller.reviews_revised.postReviews)

router.put('/reviews/:review_id/helpful', controller.reviews_revised.updateHelpfulness)
router.put('/reviews/:review_id/report', controller.reviews_revised.reportReview)

module.exports = router;