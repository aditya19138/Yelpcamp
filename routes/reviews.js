const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const Review = require('../models/reviews');
const { reviewSchema } = require('../schemas.js');
const ExpressError = require('../utils/ExpressError');

//middleware function
const validateReview = (req, res, next) => {

    const { error } = reviewSchema.validate(req.body);

    if (error) {
        console.log(error)
        res.send("Error in middleware!!")
    }
    else {
        next();

    }
}

router.post("/", validateReview, async (req, res) => {
    const { id } = req.params
    const review = new Review(req.body.review)
    const campground = await Campground.findById(id)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', 'sucessfully updated review!')
    res.redirect(`/campgrounds/${campground._id}`)
})

router.delete("/:reviewId", async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'sucessfully deleted review!')
    res.redirect(`/campgrounds/${id}`)
})

module.exports = router;