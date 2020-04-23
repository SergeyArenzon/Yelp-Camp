var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");
var middleWareObj = require("../middleware/index");


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
            res.render('campgrounds/camp_details.ejs',{campground: foundCampground}); 
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
    var rating = {
        stars :req.body.star,
        id: req.user.id
    } 
    Campground.findById(req.params.id, function(err, foundCamp){
        if(err) console.log(err);
        else{
            foundCamp.rating = rating;
            foundCamp.save();
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});


module.exports = router;