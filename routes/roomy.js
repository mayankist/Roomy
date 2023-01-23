var express = require("express");
var router = express.Router();
var Roomy = require("../models/roomy");
var middleware = require("../middleware");
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null,'./public/uploads/room');
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
	var noMatch = '';
	if(req.query.search){
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		
		Roomy.find({$or:[
				{name:regex},
				{location:regex},
				{amount:regex},
				{select1:regex},
				{select2:regex},
				{select3:regex},
				{select4:regex},
				{select5:regex},
				{select6:regex},
				{select7:regex},
				{select8:regex},
				{select9:regex},
				{select10:regex},
				{select11:regex},
				{type:regex}
				]}, function(err, allRooms){
			if(err){
				console.log(err);
			} else {
				if(allRooms.length < 1){
					noMatch = "Cannot find Rooms for your search, try again!";
				}
				res.render("roomy",{roomy:allRooms, noMatch:noMatch});
			}
		});
	} else if(req.query.sortby){

		if(req.query.sortby === "priceLow"){
			Roomy.find({})
        		.sort({
        		  amount: 1,
        		  rateAvg: -1
        		})
        		.exec(function(err, allRooms) {
        		  if (err) {
        		    console.log(err);
        		  } else {
        		    res.render("roomy", {
        		      roomy: allRooms,
        		      currentUser: req.user,
        		      noMatch: noMatch
        		    });
        		  }
        		});
		}else if(req.query.sortby === "priceHigh"){
			Roomy.find({})
        		.sort({
        		  amount: -1,
        		  rateAvg: -1
        		})
        		.exec(function(err, allRooms) {
        		  if (err) {
        		    console.log(err);
        		  } else {
        		    res.render("roomy", {
        		      roomy: allRooms,
        		      currentUser: req.user,
        		      noMatch: noMatch
        		    });
        		  }
        		});
		}else if(req.query.sortby === "rateAvg") {
      		Roomy.find({})
      		  	.sort({
      		    	rateCount: -1,
      		    	rateAvg: -1
      		  	})
      		  	.exec(function(err, allRooms) {
      		    	if (err) {
      		      		console.log(err);
      		   	 	} else {
      		      		res.render("roomy", {
      		        		roomy: allRooms,
      		        		currentUser: req.user,
      		        		noMatch: noMatch
      		      		});
      		    	}
      		  	});
    	}else if(req.query.sortby === "rateCount") {
      		Roomy.find({})
        		.sort({
          			rateCount: -1
        		})
        		.exec(function(err, allRooms) {
          			if (err) {
            			console.log(err);
          			} else {
            			res.render("roomy", {
              				roomy: allRooms,
              				currentUser: req.user,
              				noMatch: noMatch
            			});
          			}
        		});
    	}else{
			Roomy.find({}, function(err, allRooms){
				if(err){
					console.log(err);
				} else {
					res.render("roomy",{roomy:allRooms, currentUser: req.user, noMatch:noMatch});
				}
			});
		}
	} else {
		Roomy.find({}, function(err, allRooms){
			if(err){
				console.log(err);
			} else {
				res.render("roomy",{roomy:allRooms, currentUser: req.user, noMatch:noMatch});
			}
		});
	}
	// eval(require('locus'));
});

router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res) {
  if (req.file === undefined) {
      // var newUser = new User({
      //     image: "",
      //     imageId: ""
      // });
      req.body.data.booking = {
        start: req.body.data.start,
        end: req.body.data.end
      };
      Roomy.create(req.body.data, function(err, newlyCreated) {
        if(err){
          req.flash('error', err.message);
          console.log(err);
        } else {
          newlyCreated.author.id = req.user._id;
          newlyCreated.author.username = req.user.username;
          //save comment
          newlyCreated.save();
          res.redirect("/roomy");
        }
      });
  } else {
	 cloudinary.uploader.upload(req.file.path, function(result) {
    // add cloudinary url for the image to the campground object under image property
    req.body.data.image = result.secure_url;
    req.body.data.imageId = result.public_id;
    req.body.data.booking = {
      start: req.body.data.start,
      end: req.body.data.end
    };;
    // add author to campground
    Roomy.create(req.body.data, function(err, newlyCreated) {
      if(err){
        req.flash('error', err.message);
      console.log(err);
    } else {
      newlyCreated.author.id = req.user._id;
      newlyCreated.author.username = req.user.username;
      //save comment
      newlyCreated.save();
      res.redirect("/roomy");
    }
    });
  });
  }
});

//show - shows more info about one campground
router.get("/:id", function(req, res){
	Roomy.findById(req.params.id).populate("comments messages").exec(function(err, foundRoom){
		if(err || !foundRoom){
            console.log(err);
            req.flash('error', 'Sorry, that room does not exist!');
            return res.redirect('/roomy');
        }
        var ratingsArray = [];

      	foundRoom.comments.forEach(function(rating) {
      	  ratingsArray.push(rating.rating);
      	});
      	if (ratingsArray.length === 0) {
      	  foundRoom.rateAvg = 0;
      	} else {
      	  var ratings = ratingsArray.reduce(function(total, rating) {
      	    return total + rating;
      	  });
      	  foundRoom.rateAvg = ratings / foundRoom.comments.length;
      	  foundRoom.rateCount = foundRoom.comments.length;
      	}
      	foundRoom.save();

		// console.log(foundCampground);
		res.render("show", {roomy: foundRoom});
	});
});

//Edit Campground Route
router.get("/:id/edit",middleware.checkRoomOwnership,function(req, res){
	Roomy.findById(req.params.id, function(err, foundRoom){
		if(err){
			res.redirect("/roomy");
		}else{
			res.render("edit", {roomy: foundRoom});
		}
	});
});

//Update Campground Route
router.put("/:id", middleware.checkRoomOwnership,function(req, res){

	req.body.roomy.booking = {
        start: req.body.roomy.start,
        end: req.body.roomy.end
    };

    // req.body.data.tags = req.body.data.tags.split(",");

  Roomy.findByIdAndUpdate(req.params.id, req.body.roomy, function(err, updatedRoom){
    if(err){
      req.flash("error", err.message);
      res.redirect("/roomy");
    }else{
      req.flash("success","Successfully Updated!");
      res.redirect("/roomy/" + req.params.id);
    }
  });
});


//Destroy Campground Route
router.delete("/:id", middleware.checkRoomOwnership,function(req, res){
	Roomy.findByIdAndRemove(req.params.id, function(err){
    if(err){
      req.flash('error', err.message);
      res.redirect("/roomy");
    }else{
      req.flash('error', 'Room deleted!');
      res.redirect("/roomy");
    }
  });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;