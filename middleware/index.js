var Roomy = require("../models/roomy");
var Comment = require("../models/comment");
var Message = require("../models/message");
var User = require("../models/user");
var middlewareObj = {}

middlewareObj.checkRoomOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Roomy.findById(req.params.id, function(err, foundRoom){
			if(err || !foundRoom){
				req.flash("error", "Sorry, that room does not exist!");
				res.redirect("back");
			} else {
				if(foundRoom.author.id.equals(req.user._id)){
					req.roomy = foundRoom;
					next();
				} else{
					req.flash("error", "You don't have permission to do that");
					res.redirect("/roomy/" + req.params.id);
					// res.redirect("back");
				}
			}
		});
	} else{
		req.flash("error", "You must be signed in to do that!");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err || !foundComment){
				req.flash('error', 'Sorry, that comment does not exist!');
				res.redirect("back");
			} else {
				//does user own the comment?
				if(foundComment.author.id.equals(req.user._id)){
					req.comment = foundComment;
					next();
				} else{
					req.flash("error", "You don't have permission to do that");
					res.redirect("/roomy/" + req.params.id);
					// res.redirect("back");
				}
			}
		});
	} else{
		req.flash("error", "You must be signed in to do that!");
		res.redirect("back");
	}
}

middlewareObj.checkMessageOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Message.findById(req.params.message_id, function(err, foundMessage){
			if(err || !foundComment){
				req.flash('error', 'Sorry, that massage does not exist!');
				res.redirect("back");
			} else {
				//does user own the comment?
				if(foundMessage.author.id.equals(req.user._id)){
					next();
				} else{
					req.flash("error", "You don't have permission to do that");
					res.redirect("/roomy/" + req.params.id);
					// res.redirect("back");
				}
			}
		});
	} else{
		req.flash("error", "You must be signed in to do that!");
		res.redirect("back");
	}
}

middlewareObj.checkProfileOwnership = function(req, res, next) {
	if(req.isAuthenticated()){
  		User.findById(req.params.user_id, function(err, foundUser) {
    		if (err || !foundUser) {
      			req.flash("error", "Sorry, that user doesn't exist");
      			res.redirect("/roomy");
    		} else if (foundUser._id.equals(req.user._id)) {
      			req.user = foundUser;
      			next();
    		} else {
      			req.flash("error", "You don't have permission to do that!");
      			res.redirect("/roomy/" + req.params.user_id);
    		}
  		});
  	}else{
		req.flash("error", "You must be signed in to do that!");
		res.redirect("back");
	}
};

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = middlewareObj;