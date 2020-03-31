var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var  mongoose = require('mongoose');
var Post = require("./models/post");
var User = require("./models/user");
var Campground = require("./models/campgrounds");
var SeedDB = require('./seeds');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// Mongodb connection
mongoose.connect('mongodb://localhost/yelp_camp',{ useUnifiedTopology: true, useNewUrlParser: true });



SeedDB();

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
            res.render('campgrounds.ejs',{campgrounds:allCamps});
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
    res.render('new.ejs')
});


// Details obout specific campground

app.get('/campgrounds/:id',function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log("campground dont found!")
        }else{
            res.render('camp_details.ejs',{campground: foundCampground}); 
        }
    });
});






app.listen(8080,process.env.ip,function(){
    console.log('Server is running!');
})