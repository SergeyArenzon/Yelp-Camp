var mongoose = require("mongoose");

// Comment - title, content

var commentSchema = new mongoose.Schema({
    text: String,
    author: String
});

var Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;