var express = require("express");
var router = express.Router({mergeParams: true}); //makes req.params get visible
var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");

// -------------------------
// /campgrounds/:id/comments
// -------------------------


router.get("/new", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err) console.log(err);
        else{
            res.render("comments/new.ejs", {campground:foundCampground});
        }
    });
});

router.post('/', isLoggedIn, function(req,res){
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
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});


// EDIT COMMENT

router.get("/:commentId/edit", checkCommentOwnership, function(req, res){

    Comment.findById(req.params.commentId, function(err, editedComment){
        if(err) console.log("comment for eddit not found");
        else{
            res.render("comments/edit.ejs", {comment: editedComment, campground_id: req.params.id});
        }
    })
});

// UPDATE COMMENT

router.put("/:commentId", checkCommentOwnership, function(req, res){
    Comment.findById(req.params.commentId, function(err, updatedComment){
        if(err) console.log("update comment not found");
        else{
            updatedComment.text = req.body.text;
            updatedComment.save();
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});



// DELETE COMMENT

router.delete("/:commentId", checkCommentOwnership, function(req, res){
    Comment.findByIdAndDelete(req.params.commentId, function(err, deletedComment){
        if(err) console.log("comment delete id not found");
        else{
            res.redirect("back");
        }
    })
});



function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


function checkCommentOwnership(req, res, next){
    if(req.isAuthenticated()){ // logged in
        Comment.findById(req.params.commentId, function(err, foundComment){
            if(err) console.log("comment by id not found");
            else{
                if(foundComment.author.id.equals(req.user._id)){ // is the owner of the comment
                    next();
                }else{
                    res.redirect("back");
                }
            }
        })

    }else{ // is'nt logged in
        res.redirect("/login")


    }
}




module.exports = router;