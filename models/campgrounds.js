var mongoose = require("mongoose");


// Schema setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    price: String,
    rating: Number,
    author:{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    ratings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Rating"
        }
    ]
});






var Campground = mongoose.model("campgrounds",campgroundSchema);

module.exports = Campground;