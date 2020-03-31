var mongoose = require('mongoose');
var Campground = require('./models/campgrounds');
var Comment = require("./models/comment");


var campsDB = [
    {
        name: "Harod Spring campsite",
        image: "https://www.parks.org.il/wp-content/themes/joomi/inc/imgp.php?src=https://sales.parks.org.il//images/Fittings/ratag/Prod_Pic/514/514_Big.jpg&width=280&co=8&q=60",
        description: "Camping plus a dip: Sleep under the stars at the foot of storied Mount Gilboa"
    },
    {
        name: "Horshat Tal campsite",
        image: "https://www.parks.org.il/wp-content/themes/joomi/inc/imgp.php?src=https://sales.parks.org.il//images/Fittings/ratag/Prod_Pic/777/777_Big.jpg&width=280&co=8&q=60",
        description: "Galilee peace and quiet: an unforgettable family experience on the banks of spar"
    },
    {
        name: "Yehiam Fortress campsite",
        image: "https://www.parks.org.il/wp-content/themes/joomi/inc/imgp.php?src=https://sales.parks.org.il//images/Fittings/ratag/Prod_Pic/503/503_Big.jpg&width=280&co=8&q=60",
        description: "A night with the knights: when was the last time you fell asleep at an ancient"
    }
]


function seedDB(){
    
    // remove all db campgrounds
    Campground.remove({}, function(err){
        if(err) console.log(err);
        else{
            console.log("removed campgrounds!");

             // add some campgrounds
            Campground.create(campsDB, function(err){
                if(err) console.log(err);
                else{
                    console.log("camps db created!");

                    // create comment
                    Comment.create({
                        text: "best camp ever!",
                        author: "S.Arenzon"
                    }, function(err, comment){
                        if(err) console.log(err);
                        else {
                            console.log("Comments created!"); 
                            // loop over all camps
                            Campground.find({}, function(err, campgrounds){
                                    if(err) console.log(err);
                                    else{
                                        campgrounds.forEach(function(camp){
                                            camp.comments.push(comment);
                                            camp.save();
                                        })
                                    }
                                })
                        }
                    })
                } 
            });
        }
    });
}







module.exports = seedDB;