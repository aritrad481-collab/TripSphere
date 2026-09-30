const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError.js");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const geocodingClient = mbxGeocoding({
    accessToken: process.env.MAP_TOKEN
});


// =====================================================
// INDEX
// =====================================================

module.exports.index = async (req, res) => {

    const allListings = await Listing.find({});

    res.render("listings/index", {
        allListings
    });

};


// =====================================================
// NEW FORM
// =====================================================

module.exports.renderNewForm = (req, res) => {

    res.render("listings/new");

};


// =====================================================
// SHOW LISTING
// =====================================================

module.exports.showListing = async (req, res) => {

    const { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        })
        .populate("owner");

    if (!listing) {

        req.flash(
            "error",
            "Listing does not exist!"
        );

        return res.redirect("/listings");

    }

    console.log("--------------------------------");
    console.log("LISTING:", listing.title);
    console.log("LOCATION:", listing.location);
    console.log("GEOMETRY:", listing.geometry);
    console.log("--------------------------------");

    res.render("listings/show", {
        listing
    });

};


// =====================================================
// CREATE LISTING
// =====================================================

module.exports.createListing = async (req, res, next) => {

    try {

        const location = req.body.listing.location;

        console.log("Searching location:", location);


        // Mapbox Geocoding
        const response = await geocodingClient
            .forwardGeocode({
                query: location,
                limit: 1
            })
            .send();


        // Check location
        if (
            !response.body.features ||
            response.body.features.length === 0
        ) {

            req.flash(
                "error",
                "Location not found. Please enter a valid location."
            );

            return res.redirect("/listings/new");

        }


        const newListing =
            new Listing(req.body.listing);


        // Owner
        newListing.owner = req.user._id;


        // Image
        if (req.file) {

            newListing.image = {
                url: req.file.path,
                filename: req.file.filename
            };

        }


        // Geometry
        newListing.geometry =
            response.body.features[0].geometry;


        console.log(
            "Location:",
            location
        );

        console.log(
            "Coordinates:",
            newListing.geometry.coordinates
        );


        // Save
        const savedListing =
            await newListing.save();


        console.log(
            "Listing saved:",
            savedListing._id
        );


        req.flash(
            "success",
            "New Listing Created!"
        );


        res.redirect("/listings");

    } catch (err) {

        next(err);

    }

};


// =====================================================
// EDIT FORM
// =====================================================

module.exports.renderEditForm = async (req, res) => {

    const { id } = req.params;

    const listing =
        await Listing.findById(id);


    if (!listing) {

        throw new ExpressError(
            404,
            "Listing not found"
        );

    }


    let originalImageUrl = null;


    if (
        listing.image &&
        listing.image.url
    ) {

        originalImageUrl =
            listing.image.url.replace(
                "/upload",
                "/upload/h_300,w_250"
            );

    }


    res.render(
        "listings/edit",
        {
            listing,
            originalImageUrl
        }
    );

};


// =====================================================
// UPDATE LISTING
// =====================================================

module.exports.updateListing = async (req, res, next) => {

    try {

        const { id } = req.params;


        const listing =
            await Listing.findById(id);


        if (!listing) {

            throw new ExpressError(
                404,
                "Listing not found"
            );

        }


        // Update fields
        listing.title =
            req.body.listing.title;

        listing.description =
            req.body.listing.description;

        listing.price =
            req.body.listing.price;

        listing.location =
            req.body.listing.location;

        listing.country =
            req.body.listing.country;


        // Update image
        if (req.file) {

            listing.image = {
                url: req.file.path,
                filename: req.file.filename
            };

        }


        // ============================
        // GEOCODING
        // ============================

        const response =
            await geocodingClient
                .forwardGeocode({
                    query: listing.location,
                    limit: 1
                })
                .send();


        if (
            !response.body.features ||
            response.body.features.length === 0
        ) {

            req.flash(
                "error",
                "Location not found."
            );

            return res.redirect(
                `/listings/${id}/edit`
            );

        }


        // Update geometry
        listing.geometry =
            response.body.features[0].geometry;


        console.log(
            "Updated coordinates:",
            listing.geometry.coordinates
        );


        // Save
        await listing.save();


        req.flash(
            "success",
            "Listing Updated!"
        );


        res.redirect(
            `/listings/${id}`
        );

    } catch (err) {

        next(err);

    }

};


// =====================================================
// DELETE LISTING
// =====================================================

module.exports.destroyListing = async (
    req,
    res,
    next
) => {

    try {

        const { id } = req.params;


        const deletedListing =
            await Listing.findByIdAndDelete(id);


        if (!deletedListing) {

            throw new ExpressError(
                404,
                "Listing not found"
            );

        }


        req.flash(
            "success",
            "Listing Deleted!"
        );


        res.redirect("/listings");

    } catch (err) {

        next(err);

    }

};