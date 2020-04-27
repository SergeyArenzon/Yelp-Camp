var express = require("express");
var router = express.Router({mergeParams: true}); //makes req.params get visible
var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");
var middleWareObj = require("../middleware/index");
// -------------------------
// /campgrounds/:id/comments
// -------------------------


router.get("/new", middleWareObj.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err) console.log(err);
        else{
            res.render("comments/new.ejs", {campground:foundCampground});
        }
    });
});

router.post('/', middleWareObj.isLoggedIn, function(req,res){
    var comment = {
        text: req.body.text,
        author:{
            id: req.user._id,
            username: req.user.username
        }
    }
    Comment.create(comment, function(err, comment){
        if(err) console.log(err);
        else{
            // find specific camp
            Campground.findById(req.params.id, function(err, campground){
                if(err) console.log(err);
                else{
                    // push comment to found camp
                    campground.comments.push(comment);
                    campground.save();
                    console.log("New comment added!");
                    req.flash("success", "YOUR COMMENT WAS ADDED SUCCESSFULY!");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});


// EDIT COMMENT

router.get("/:commentId/edit", middleWareObj.checkCommentOwnership, function(req, res){

    Comment.findById(req.params.commentId, function(err, editedComment){
        if(err) console.log("comment for eddit not found");
        else{
            res.render("comments/edit.ejs", {comment: editedComment, campground_id: req.params.id});
        }
    })
});

// UPDATE COMMENT

router.put("/:commentId", middleWareObj.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.commentId, function(err, updatedComment){
        if(err) console.log("update comment not found");
        else{
            updatedComment.text = req.body.text;
            updatedComment.save();
            req.flash("success", "YOUR COMMENT WAS EDITED SUCCESSFULY!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});



// DELETE COMMENT

router.delete("/:commentId", middleWareObj.checkCommentOwnership, function(req, res){
    Comment.findByIdAndDelete(req.params.commentId, function(err, deletedComment){
        if(err) console.log("comment delete id not found");
        else{
            req.flash("success", "YOUR COMMENT WAS DELETED SUCCESSFULY!");
            res.redirect("back");
        }
    })
});


module.exports = router;