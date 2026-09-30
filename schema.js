const Joi = require("joi");

const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string()
            .required(),

        description: Joi.string()
            .required(),

        location: Joi.string()
            .required(),

        country: Joi.string()
            .required(),

        price: Joi.number()
            .min(0)
            .required(),

        image: Joi.object({
            filename: Joi.string().allow(""),
            url: Joi.string().allow("")
        }).allow({})
    }).required()
});


const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number()
            .integer()
            .min(1)
            .max(5)
            .required(),

        comment: Joi.string()
            .trim()
            .min(5)
            .max(500)
            .required()
    }).required()
});


module.exports = {
    listingSchema,
    reviewSchema
};