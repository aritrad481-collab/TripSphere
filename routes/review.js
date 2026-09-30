const express = require("express");
const router = express.Router({ mergeParams: true });

const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");
// CREATE REVIEW
// POST /listings/:id/reviews

router.post(
    "/:id/reviews",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview)
);


// DELETE REVIEW
// DELETE /listings/:listingId/reviews/:reviewId

router.delete(
    "/:listingId/reviews/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview)
);


module.exports = router;