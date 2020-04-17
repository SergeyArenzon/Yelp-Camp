var Comment = require("../models/comment");
var Campground = require("../models/campgrounds");


// -----------
// MIDDLEWARES
// -----------

var middleWareObj = {};

// CHECK IF THE CAMP OWNED BY USER
middleWareObj.checkCampOwnership = function(req, res, next){
    if(req.isAuthenticated()){// loggedin
        Campground.findById(req.params.id, function(err, campground){
        if(err) console.log("campgrounds not found!");
        else{
            if(campground.author.id.equals(req.user._id)){// authenticated
                next();
            }else {
                res.redirect("back");
            }
        }
    })
    }else{// not loggedin
        res.redirect("/login");
    }
};



// CHECK IF THE USER IS CONNECTED
middleWareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "PLEASE LOG IN!");
    res.redirect("/login");
}


// CHECK IF THE COMMENT OWNED BY USER
middleWareObj.checkCommentOwnership = function(req, res, next){
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
        res.redirect("/login");
    }
}





module.exports = middleWareObj;