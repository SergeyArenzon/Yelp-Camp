var Campground = require('../../models/campgrounds');

// calc finds ratings with campid and return avg rating 
async function avgRatingCalcuator(camp_id){
    var ratings_size;
    var ratings_sum = 0;
    Campground.findById(camp_id).populate("ratings").exec(function(err, foundCamp){
        ratings_size = foundCamp.ratings.length;
        if(err) console.log(err);
        else{
            foundCamp.ratings.forEach(rating => {
            ratings_sum += rating.stars;
                
            });
        }
    });
return await ratings_sum/ratings_size;

};

module.exports =  avgRatingCalcuator;