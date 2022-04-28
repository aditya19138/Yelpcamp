const express = require('express');
const router = express.Router();
const User = require('../models/users');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');


router.get('/register', (req, res) => {
    res.render('../views/users/registration.ejs')
})


router.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const newUser = await User.register(user, password);
        req.flash('success', 'Welcome to Yelpcamp');
        res.redirect('/campgrounds')
    }
    catch (e) {
        console.log(e.message)
        req.flash('error', e.message)
        res.redirect('/register')
    }
}))

router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome Back!!')
    res.redirect('/campgrounds')
})

module.exports = router;