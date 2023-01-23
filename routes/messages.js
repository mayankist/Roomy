var express = require("express");
var router = express.Router({mergeParams: true});
var Roomy = require("../models/roomy");
var Message = require("../models/message");
var middleware = require("../middleware");

//Comments New
router.get("/",middleware.isLoggedIn, function(req, res){
	//find campground by id
	Roomy.findById(req.params.id, function(err, room){
		if(err){
			req.flash("error", "Something went wrong");
			console.log(err);
		}else{
			res.render("messages/roomy", {roomy: room});
		}
	});
});

//Comments Create
router.post("/",middleware.isLoggedIn, function(req, res){
	//lookup campground using id
	Roomy.findById(req.params.id, function(err, roomy){
		if(err){
			req.flash("error", "Something went wrong");
			console.log(err);
			res.redirect("/roomy");
		}else{
			Message.create(req.body.message, function(err, message){
				if(err){
					req.flash("error", "Something went wrong");
					console.log(err);
				}else{
					//add username and id to comment
					message.author.id = req.user._id;
					message.author.username = req.user.username;
					//save comment
					message.save();
					roomy.messages.push(message);
					roomy.save();
					req.flash("success", "Successfully added message!");
					res.redirect('/roomy/' + roomy._id);
				}
			});
		}
	});
});

// Comment Destroy Route
router.delete("/:message_id",middleware.checkMessageOwnership, function(req, res){
	Message.findByIdAndRemove(req.params.message_id, function(err){
		if(err){
			res.redirect("back");
		} else{
			req.flash("success","Message deleted");
			res.redirect("/roomy/" + req.params.id);
		}
	});
});

module.exports = router;