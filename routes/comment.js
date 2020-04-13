var express = require("express");
var router = express.Router({mergeParams: true}); //makes req.params get visible
var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");

// -------------------------
// /campgrounds/:id/comments
// -------------------------


router.get("/new", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err) console.log(err);
        else{
            res.render("comments/new.ejs", {campground:foundCampground});
        }
    });
});

router.post('/', isLoggedIn, function(req,res){
    var comment = {
       text: req.body.text,
       author:{
           id: req.user._id,
           username: req.user.username
       }
    }
    Comment.create(comment, function(err, comment){
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


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}



module.exports = router;