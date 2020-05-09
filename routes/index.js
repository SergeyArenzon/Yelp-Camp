var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");



// -------------------------
// /
// -------------------------


router.get("/",function(req,res){
    res.render('landing.ejs');
});

// ===========
// AUTH ROUTES
// ===========


// register
router.get("/register", function(req, res){
    res.render("register.ejs");
});

// sign up
router.post("/register", function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    User.register(new User({username: username}), password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/register");
        }else{
                passport.authenticate("local")(req, res, function(){
                    req.flash("success", "Welcome to YelpCamp " + user.username);
                    res.redirect("/campgrounds");
            })
        } 
    } );

});


// login
router.get("/login", function(req, res){
    res.render("login.ejs");
});

// router.post('/login', passport.authenticate("local",
// {   
    

//     successFlash: "Hello " ,
//     successRedirect: '/campgrounds',
//     failureFlash: 'Invalid username or password.',
//     failureRedirect: "/login"
// }
// ), function(req, res){

// });


// authentication with flash feedback
router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) { 
        return next(err); 
        }
        if (!user) {  
            req.flash("error", "INCORRECT Username or Password!");
            return res.redirect('/login');
        }
        req.logIn(user, function(err) {
            if (err) { 
                return next(err); 
            }
            req.flash("success", "Hello "+ user.username);
            return res.redirect('/campgrounds');
        });
    })(req, res, next);
});



// logout
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "YOU LOGGED OUT!");
    res.redirect("/campgrounds");
});



module.exports = router;