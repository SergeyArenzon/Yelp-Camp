var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Campground = require("./models/campgrounds");
var Comment = require("./models/comment");
var SeedDB = require('./seeds');
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// Mongodb connection
mongoose.connect('mongodb://localhost/yelp_camp',{ useUnifiedTopology: true, useNewUrlParser: true });

//stylesheets dir
app.use(express.static(__dirname+"/public"));


//SeedDB();

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
    next();
});
// ======
// ROUTES 
// ======


app.get("/",function(req,res){
    res.render('landing.ejs')
});


app.get("/campgrounds",function(req,res){
    // Get all canpground db
    Campground.find({},function(err,allCamps){
        if(err){
            console.log(err);
        }
        else{
            res.render('campgrounds/campgrounds.ejs',{campgrounds:allCamps});
        }
    });
    
});


app.post('/campgrounds',function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description
    // Adding new camp to db
    Campground.create(
    {name: name, image: image, description:desc},
    function(err,campground){
        if(err){
            console.log("Error!");
        }else{
            console.log("Camp was added!!!"); 
        }
    }
);
    
    res.redirect('/campgrounds');
});


// Creating new campground page
app.get('/campgrounds/new', function(req,res){
    res.render('campgrounds/new.ejs')
});


// Details obout specific campground

app.get('/campgrounds/:id',function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log("campground dont found!")
        }else{
            res.render('campgrounds/camp_details.ejs',{campground: foundCampground}); 
        }
    });
});


app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err) console.log(err);
        else{
            res.render("comments/new.ejs", {campground:foundCampground});
        }
    });
});

app.post('/campgrounds/:id/comments', isLoggedIn, function(req,res){
    
    // create new comment
    Comment.create(req.body.comment, function(err, comment){
        if(err) console.log(err);
        else{
            // find specific camp
            Campground.findById(req.params.id, function(err, campground){
                if(err) console.log(err);
                else{
                    // push comment to found camp
                    campground.comments.push(comment);
                    campground.save();
                    console.log("New comment added!");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});


// ===========
// AUTH ROUTES
// ===========


// register
app.get("/register", function(req, res){
    res.render("register.ejs");
})
// sign up
app.post("/register", function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    User.register(new User({username: username}), password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register.ejs");
        }else{
                passport.authenticate("local")(req, res, function(){
                res.redirect("/campgrounds")
            })
        } 
    } );

});


// login
app.get("/login", function(req, res){
    res.render("login.ejs")
});

app.post('/login', passport.authenticate("local",
{
    successRedirect: '/campgrounds',
    failureRedirect: "/login"
}
), function(req, res){
    
});

// logout

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}



app.listen(8080,process.env.ip,function(){
    console.log('Server is running!');
});