var mongoose = require("mongoose");

var roomySchema = new mongoose.Schema({
	author:{
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments:[
		{
			type:mongoose.Schema.Types.ObjectId,
			ref:"Comment"
		}
	],
	messages:[
		{
			type:mongoose.Schema.Types.ObjectId,
			ref:"Message"
		}
	],
	hasRated: [
    	{
    	  	type: mongoose.Schema.Types.ObjectId,
    	  	ref: "User"
    	}
  	],
	createdAt: { type: Date, default: Date.now },
	booking: {
  	  	start: String,
  	  	end: String
  	},
  	tags: [],
	amount: String,
	name: String,
	number: String,
	type: String,
	location: String,
	image: String,
	imageId: String,
	select1: String,
	select2: String,
	select3: String,
	select4: String,
	select5: String,
	select6: String,
	select7: String,
	select8: String,
	select9: String,
	select10: String,
	select11: String,
	rateAvg: Number,
  	rateCount: Number
});

module.exports = mongoose.model("Roomy", roomySchema);