var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Campground = require("./models/campgrounds");
var Comment = require("./models/comment");
var SeedDB = require('./routes');
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var methodOverride = require("method-override");
var flash = require("connect-flash");
require('dotenv').config()

// ROUTES
var commentRoutes = require("./routes/comment"),
    campgroundRoutes = require("./routes/campground"),
    indexRoutes = require("./routes/index");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))


//console.log(process.env.DATABASEURL);

// DBs
var url = process.env.DATABASEURL ;
// MongoDB connection

console.log(url)
mongoose.connect(
    url, 
    {useNewUrlParser: true, useUnifiedTopology: true});

//stylesheets dir
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
//SeedDB();  //  seed db


// ======================
// PASSPORT CONFIGURATION
// ======================

app.use(require("express-session")({
    secret: "secrettttttttt",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// ROUTES
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);



app.listen(process.env.PORT || 8080, process.env.ip, function(){
    
    console.log('Server is running!');
});
