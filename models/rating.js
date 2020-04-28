var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ratingSchema = new Schema({
    stars: Number,
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

var Rating = mongoose.model('Rating', ratingSchema);
module.exports = Rating;