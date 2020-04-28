var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");
var middleWareObj = require("../middleware/index");
var Rating = require('../models/rating')
var js_scripts = require('./../public/javascripts/index.js');



// ------------
// /campgrounds
// ------------


router.get("/", function(req,res){
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


router.post('/', middleWareObj.isLoggedIn, function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description
    var price = req.body.price;
    // Adding new camp to db
    Campground.create(
    {name: name, image: image, description:desc,price: price,
        author:{id: req.user._id, username: req.user.username}
    },
    function(err,campground){
        if(err){
            console.log("Error!");
        }else{
            console.log("Camp was added!!!"); 
        }
    }
);
    req.flash("success", "NEW POST WAS CREATED SUCCESSFULY!");
    res.redirect('/campgrounds');
});


// Creating new campground page
router.get('/new', middleWareObj.isLoggedIn, function(req,res){
    res.render('campgrounds/new.ejs')
});

// Details obout specific campground
router.get('/:id',function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log("campground dont found!")
        }else{

            // find current camp and compute Avg.Rating
            Campground.findById(req.params.id).populate("ratings").exec(function(err, foundCamp){
                if(err) console.log(err);
                else{
                    // check if camp has no ratings and return Avg.Rating = 0
                    if(foundCamp.ratings.length < 1) {
                        var camp_avg_rating = 0;
                    }
                    else{
                        var camp_avg_rating = js_scripts(foundCamp.ratings).toFixed(1);
                    }
                }
                res.render('campgrounds/camp_details.ejs',{campground: foundCampground, rating: camp_avg_rating});
            })
        }   
    });
});

// edit camp
router.get("/:id/edit", middleWareObj.checkCampOwnership,function(req, res){
    Campground.findById(req.params.id, function(err, campground){
    if(err) console.log("campgrounds not found!");
    else{
        
        res.render("campgrounds/edit.ejs", {campground: campground});
        }
    })
});


// update camp
router.put("/:id", middleWareObj.checkCampOwnership,function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCamp){
        
        if(err) console.log("update camp not found!");
        else{
            req.flash("success", "YOUR POST WAS EDITED SUCCESSFULY!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
})

// delete camp

router.delete("/:id", middleWareObj.checkCampOwnership,function(req, res){
    
    Campground.findByIdAndDelete(req.params.id, function(err, deletedCamp){
        if(err) console.log("cant find and delete camp");
        else{
            req.flash("success", "YOUR POST WAS DELETED SUCCESSFULY!");
            res.redirect("/campgrounds")
        }
    });
});


// RATING ROUTE
router.post("/:id/rating", middleWareObj.isLoggedIn, function(req, res){

    // user input NaN scenario -> req.body.star = 0
    if(req.body.star === undefined) {
        req.body.star = 0;
    } 
    
    var new_rating = {
        stars : req.body.star,
        user: req.user.id,
    } 
    
    Campground.findById(req.params.id).populate("ratings").exec( function(err, foundCampground){
        
        var rating_exist = false;

        foundCampground.ratings.forEach(rating => {      
            // check if rating exist
            // if exist update stars to inputed stars
            if(rating.user == req.user.id && !rating_exist) { 
                rating_exist = true;
                
                Rating.findById(rating._id, function(err, foundRating){
                    if(err) console.log(err);
                    else{
                        foundRating.stars = req.body.star; 
                        foundRating.save();
                    }
                })
            }
        });
        // if rating not exist 
        // create new rating and push it to campground
        if(rating_exist === false){
            Rating.create(new_rating, function(err, newRating){ 
                if(err) console.log(err);
                else{
                    foundCampground.ratings.push(newRating);
                    foundCampground.save();
                }
            })
        }       
    });
    res.redirect('/campgrounds/' + req.params.id );
});

module.exports = router;