var mongoose = require('mongoose');

var userScheme = new mongoose.Schema({
    email: String,
    name: String,
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
            
        }
    ]
});

var User = mongoose.model("User", userScheme);

module.exports = User;