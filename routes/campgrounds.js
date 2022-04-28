const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const isLoggedIn = require('../middlewares');

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campground/index', { campgrounds })
}))

router.post("/", isLoggedIn, catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground)
    await campground.save()
    req.flash('success', 'Successfully added a campground')
    res.redirect("/campgrounds")
}))

router.get("/new", isLoggedIn, (req, res) => {
    res.render("campground/new")
})

router.get("/:id", catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id).populate('reviews')
    res.render('campground/show', { campground })
}))

router.get("/:id/edit", catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    res.render("campground/edit", { campground })
}))

router.put("/:id", catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete("/:id", catchAsync(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds")
}))

module.exports = router;