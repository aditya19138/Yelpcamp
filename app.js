const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/users')
const userRoutes = require('./routes/user');




mongoose.connect("mongodb://localhost:27017/yelp-camp")
    .then(() => {
        console.log("Database Connected !!")
    })
    .catch(err => {
        console.log("DB COnnection Error !!")
    });

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

const sessionConfig = {
    secret: 'helloworld',
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 2,     //date is in ms and sessio will expire after 2 days
        maxAge: 1000 * 60 * 60 * 24 * 2
    }
}
app.use(session(sessionConfig))
app.use(flash())
app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next();
})

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)     //since here we are passing id to review route => mergeParams=true
app.use('/', userRoutes)

app.get('/', (req, res) => {
    res.render('home')
})


app.use((err, req, res, next) => {
    console.log("Error Found!!")
    next(err);
})

app.listen(3000, () => {
    console.log("Listening on port 3000 !!")
});




