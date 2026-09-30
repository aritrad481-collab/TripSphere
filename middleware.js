const Listing = require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");


// IS LOGGED IN

module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {

        req.session.redirectUrl = req.originalUrl;

        req.flash(
            "error",
            "You must be logged in to create listings!"
        );

        return res.redirect("/login");
    }

    next();
};


// SAVE REDIRECT URL

module.exports.saveRedirectUrl = (req, res, next) => {

    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }

    next();
};


// IS OWNER

module.exports.isOwner = async (req, res, next) => {

    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }

    if (!listing.owner.equals(res.locals.currUser._id)) {

        req.flash(
            "error",
            "You are not the owner of this listing"
        );

        return res.redirect(`/listings/${id}`);
    }

    next();
};


// VALIDATE LISTING

module.exports.validateListing = (req, res, next) => {

    const { error } = listingSchema.validate(req.body);

    if (error) {

        const errMsg = error.details
            .map((el) => el.message)
            .join(",");

        throw new ExpressError(400, errMsg);
    }

    next();
};


// VALIDATE REVIEW

module.exports.validateReview = (req, res, next) => {

    const { error } = reviewSchema.validate(req.body);

    if (error) {

        const errMsg = error.details
            .map((el) => el.message)
            .join(",");

        throw new ExpressError(400, errMsg);
    }

    next();
};

// IS AUTHOR

module.exports.isReviewAuthor = async (req, res, next) => {

    const { id,reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
        throw new ExpressError(404, "Listing not found");
    }

    if (!review.author.equals(res.locals.currUser._id)) {

        req.flash(
            "error",
            "You are not the author of this review"
        );

        return res.redirect(`/listings/${id}`);
    }

    next();
};