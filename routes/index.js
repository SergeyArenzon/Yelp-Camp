var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


// -------------------------
// /
// -------------------------



router.get("/",function(req,res){
    res.render('landing.ejs')
});

// ===========
// AUTH ROUTES
// ===========


// register
router.get("/register", function(req, res){
    res.render("register.ejs");
})
// sign up
router.post("/register", function(req, res){
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
router.get("/login", function(req, res){
    res.render("login.ejs")
});

router.post('/login', passport.authenticate("local",
{
    successRedirect: '/campgrounds',
    failureRedirect: "/login"
}
), function(req, res){
    
});

// logout

router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});



module.exports = router;