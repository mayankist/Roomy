var express = require("express");
var router = express.Router({mergeParams: true});
var Roomy = require("../models/roomy");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments New
router.get("/",middleware.isLoggedIn, function(req, res){
	//find campground by id
	Roomy.findById(req.params.id, function(err, room){
		if(err){
			console.log(err);
		}else{
			res.render("comments/roomy", {roomy: room});
		}
	});
});

//Comments Create
router.post("/",middleware.isLoggedIn, function(req, res){
	//lookup campground using id
	Roomy.findById(req.params.id, function(err, found){
		if(err){
			console.log(err);
			res.redirect("/roomy");
		}
		var ratedArray = [];
    	found.hasRated.forEach(function(rated) {
    	  ratedArray.push(String(rated));
    	});
    	if (ratedArray.includes(String(req.user._id))) {
      		req.flash(
        		"error",
        		"You've already reviewed this room, please edit your review instead."
      		);
      		res.redirect("/roomy/" + req.params.id);
    	} else {
      		Roomy.findById(req.params.id, function(err, roomy) {
        		if (err) {
          			console.log(err);
          			res.redirect("/roomy");
        		} else {
					Comment.create(req.body.comment, function(err, comment){
						if(err){
							req.flash("error", "Something went wrong");
							console.log(err);
						}else{
							//add username and id to comment
							comment.author.id = req.user._id;
							comment.author.username = req.user.username;
							roomy.hasRated.push(req.user._id);
              				roomy.rateCount = roomy.comments.length;
							//save comment
							comment.save();
							roomy.comments.push(comment);
							roomy.save();
							req.flash("success", "Successfully added comment");
							res.redirect('/roomy/' + roomy._id);
						}
					});		
				}
			});
		}
	});	
});

// Comment Destroy Route
router.delete("/:comment_id",middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			req.flash('error', err.message);
			res.redirect("back");
		} else{
			Roomy.findByIdAndUpdate(
      		  req.params.id,
      		  { $pull: { comments: { $in: [req.params.comment_id] } } },
      		  function(err) {
      		    if (err) {
      		      console.log(err);
      		    }
      		  }
      		);
      		Roomy.findByIdAndUpdate(
      		  req.params.id,
      		  { $pull: { hasRated: { $in: [req.user._id] } } },
      		  function(err) {
      		    if (err) {
      		      console.log(er);
      		    }
      		  }
      		);
			req.flash("success","Comment deleted");
			res.redirect("/roomy/" + req.params.id);
		}
	});
});

module.exports = router;