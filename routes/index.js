var express 	= require("express"),
	router 		= express.Router(),
	passport 	= require("passport"),
	User 		= require("../models/user"),
	middleware 	= require("../middleware"),
	Roomy 		= require("../models/roomy"),
	Comment 	= require("../models/comment");

var multer = require('multer');
var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null,'./public/uploads/user');
  }, filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var upload = multer({storage: storage});

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'meraroom', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

router.get("/",function(req, res){
  res.redirect("roomy");
});

// router.get("/",function(req, res){
// 	res.render("roomy");
// });

router.get("/user", function(req, res){
	res.render("user");
});

router.get("/property",middleware.isLoggedIn, function(req, res){
	res.render("property");
});

//handling user sign
router.post("/register", upload.single('image'), function(req, res){
  if (req.file === undefined) {
    var newUser = new User({
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      fullName: req.body.fullName,
      image: "",
      imageId: ""
    });
    User.register(newUser, req.body.password, function(err, user) {
      if (err) {
        return res.render("user", {
          error: err.message
        });
      }
      passport.authenticate("local")(req, res, function() {
        res.redirect("/roomy");
      });
    });
  } else {
    cloudinary.uploader.upload(req.file.path,function(result) {
        req.body.image = result.secure_url;
        req.body.imageId = result.public_id;
        var newUser = new User({
          username: req.body.username,
          email: req.body.email,
          phone: req.body.phone,
          fullName: req.body.fullName,
          image: req.body.image,
          imageId: req.body.imageId
        });
        User.register(newUser, req.body.password, function(err, user) {
          if (err) {
            req.flash("error", err.message);
            return res.render('user');
          }
          passport.authenticate("local")(req, res, function() {
            req.flash("success", "Successfully Signed Up! Nice to meet you " + user.username);
            res.redirect("/roomy");
          });
        });
      }, {
        moderation: "webpurify"
      }
    );
  }
});

router.get("/login", function(req, res){
	if (req.user) {
    	return res.redirect("/roomy");
  	} else {
    	res.render("user");
  	}
});

router.post("/login", passport.authenticate("local", {
	successRedirect: "/roomy",
	failureRedirect: "/user",
	failureFlash: true		
}), function(req, res){
});

router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/");
});

// ========================================================================

// user profile
router.get("/users/:user_id", function(req, res) {
  	User.findById(req.params.user_id, function(err, foundUser) {
    	if (err || !foundUser) {
      		req.flash("error", "This user doesn't exist");
      		return res.render("error");
    	}
    	Roomy.find()
      		.where("author.id")
      		.equals(foundUser._id)
      		.exec(function(err, roomy) {
        		if (err) {
          			req.flash("error", "Something went wrong");
          			res.render("error");
        		}
        		Comment.find()
          			.where("author.id")
          			.equals(foundUser._id)
          			.exec(function(err, ratedCount) {
            			if (err) {
              				req.flash("error", "Something went wrong");
              				res.render("error");
            			}
            			res.render("users/show", {
              				user: foundUser,
              				roomy: roomy,
              				reviews: ratedCount
            			});
          			});
      		});
  	});
});

// edit profile
router.get(
  	"/users/:user_id/edit",
  	middleware.isLoggedIn,
  	middleware.checkProfileOwnership,
  	function(req, res) {
    	res.render("users/edit", {
      		user: req.user
    	});
  	}
);

// update profile
router.put(
  	"/users/:user_id",
  	middleware.checkProfileOwnership,
  	function(req, res) {
    	User.findById(req.params.user_id, function(err, user) {
      		if (err) {
        		req.flash("error", err.message);
      		} else {
        		user.email = req.body.email;
        		user.phone = req.body.phone;
        		user.fullName = req.body.fullName;
        		user.save();
        		req.flash("success", "Updated your profile!");
        		res.redirect("/users/" + req.params.user_id);
      		}
    	});
  	}
);

// delete user
router.delete("/users/:user_id", middleware.checkProfileOwnership, function(req,res) {
  	User.findByIdAndRemove(req.params.user_id, function(err) {
    	if (err) {
      	req.flash("error", err.message);
      	res.redirect("/roomy");
    	}else{
        req.flash('error','Profile deleted');
        res.redirect("/roomy");
      }
  	});
});

module.exports = router;