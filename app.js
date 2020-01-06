var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))


// Camps database
var campgrounds = [
    {name: "Akhziv campsite", image:"https://www.parks.org.il/wp-content/themes/joomi/inc/imgp.php?src=https://sales.parks.org.il//images/Fittings/ratag/Prod_Pic/509/509_Big.jpg&width=280&co=8&q=60"},
    {name: "Horshat Tal campsite", image:"https://www.parks.org.il/wp-content/themes/joomi/inc/imgp.php?src=https://sales.parks.org.il//images/Fittings/ratag/Prod_Pic/777/777_Big.jpg&width=280&co=8&q=60"},
    {name: "Mamshit National Park Nabataean Khan", image:"https://www.parks.org.il/wp-content/themes/joomi/inc/imgp.php?src=https://sales.parks.org.il//images/Fittings/ratag/Prod_Pic/515/515_Big.jpg&width=280&co=8&q=60"},
    {name: "Amud Stream campsite", image:"https://www.parks.org.il/wp-content/themes/joomi/inc/imgp.php?src=https://sales.parks.org.il//images/Fittings/ratag/Prod_Pic/504/504_Big.jpg&width=280&co=8&q=60"},
    {name: "Kokhav HaYarden campsite", image:"https://www.parks.org.il/wp-content/themes/joomi/inc/imgp.php?src=https://sales.parks.org.il//images/Fittings/ratag/Prod_Pic/502/502_Big.jpg&width=280&co=8&q=60"},
    {name: "Gan HaShlosha, Sahne campsite", image:"https://www.parks.org.il/wp-content/themes/joomi/inc/imgp.php?src=https://sales.parks.org.il//images/Fittings/ratag/Prod_Pic/518/518_Big.jpg&width=280&co=8&q=60"},
]






app.get("/",function(req,res){
    res.render('landing.ejs')

});






app.get("/campgrounds",function(req,res){
    
    res.render('campgrounds.ejs',{campgrounds:campgrounds});

});


app.post('/campgrounds',function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    campgrounds.push({name:name,image:image});
    res.redirect('/campgrounds');
});

app.get('/campgrounds/new', function(req,res){
    res.render('new.ejs')
});


app.listen(8080,process.env.ip,function(){
    console.log('Server is running!');
})