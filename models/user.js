var mongoose = require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");


var userScheme = new mongoose.Schema({
    username: String,
    password: String,
});

userScheme.plugin(passportLocalMongoose);
var User = mongoose.model("User", userScheme);

module.exports = User;