var Campground = require('../../models/campgrounds');




// CALCULATE THE AVG OF CAPS RATINGS
module.exports =  (camp_ratings) => {
    var sum = 0;
    var size = camp_ratings.length;

    camp_ratings.forEach(rating => {
        sum += rating.stars;
    });
    return sum / size;
};


