
var Campground = require('../../models/campgrounds');
var moment = require('moment');



// CALCULATE THE AVG OF CAPS RATINGS
// module.exports = (camp_ratings) => {
//     var sum = 0;
//     var size = camp_ratings.length;

//     camp_ratings.forEach(rating => {
//         sum += rating.stars;
//     });
//     return sum / size;
// };




module.exports = {

    // calculates avg rating of camp page
    averageRatingCount: (camp_ratings) => {
        var sum = 0;
        var size = camp_ratings.length;
    
        camp_ratings.forEach(rating => {
            sum += rating.stars;
        });
        return sum / size;
    },

    // calculates time form creating camp
    timeCalculator: (createdTime) => {
    
        return moment(createdTime, "YYYYMMDDHHmm").fromNow();
    },
};