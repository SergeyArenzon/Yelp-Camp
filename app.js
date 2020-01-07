var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var  mongoose = require('mongoose');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// Mongodb connection
mongoose.connect('mongodb://localhost/yelp_camp',{ useUnifiedTopology: true, useNewUrlParser: true });

// Schema setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

var Campground = mongoose.model("kaki",campgroundSchema);

// Campground.create(
//     {name: "Mamshit National Park Nabataean Khan", image:"https://www.parks.org.il/wp-content/themes/joomi/inc/imgp.php?src=https://sales.parks.org.il//images/Fittings/ratag/Prod_Pic/515/515_Big.jpg&width=280&co=8&q=60"},
//     function(err,campground){
//         if(err){
//             console.log("Error!");
//         }else{
//             console.log("Camp was added!!!"); 
//         }
//     }
// );





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

    // Adding new camp to db
    Campground.create(
    {name: name, image: image},
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

app.get('/campgrounds/new', function(req,res){
    res.render('new.ejs')
});























app.listen(8080,process.env.ip,function(){
    console.log('Server is running!');
})