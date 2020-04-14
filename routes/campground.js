var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");



// ------------
// /campgrounds
// ------------




router.get("/",isLoggedIn, function(req,res){
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


router.post('/', isLoggedIn, function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description
    // Adding new camp to db
    Campground.create(
    {name: name, image: image, description:desc,
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
    
    res.redirect('/campgrounds');
});


// Creating new campground page
router.get('/new', function(req,res){
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
router.get("/:id/edit", function(req, res){

    Campground.findById(req.params.id, function(err, campground){
        if(err) console.log("campgrounds not found!");
        else{
            res.render("campgrounds/edit.ejs", {campground: campground});
        }
    })
})


// update camp
router.put("/:id", function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCamp){
        if(err) console.log("update camp not found!");
        else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });



})


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}



module.exports = router;