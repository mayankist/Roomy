require("dotenv").config();
var express 				= require("express"),
	app 					= express(),
	bodyParser 				= require("body-parser"),
	mongoose 				= require("mongoose"),
	flash					= require("connect-flash"),
	passport 				= require("passport"),
	LocalStrategy 			= require("passport-local"),
	methodOverride 			= require("method-override"),
	Roomy 					= require("./models/roomy"),
	Comment 				= require("./models/comment"),
	Message					= require("./models/message"),
	User					= require("./models/user");

var roomyRoutes 	= require("./routes/roomy"),
	commentRoutes 	= require("./routes/comments"),
	messageRoutes 	= require("./routes/messages"),
	indexRoutes 	= require("./routes/index")


var url = process.env.DATABASEURL || "mongodb+srv://Mayank:workforme@cluster0.uq1zw.mongodb.net/roomy?retryWrites=true&w=majority";
// var url = process.env.DATABASEURL || "mongodb://localhost/roomy1";
mongoose.connect(url);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.locals.moment = require('moment');

app.use(require("express-session")({
	secret: "Rusty is the best and cutest dog in the world",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser 	= req.user;
	res.locals.error		= req.flash("error");
	res.locals.success		= req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/roomy", roomyRoutes);
app.use("/roomy/:id/comments", commentRoutes);
app.use("/roomy/:id/messages", messageRoutes);

// app.listen(3000,function(){
// 	console.log("Roomy is started!");
// })

const host = "0.0.0.0";
const port = process.env.PORT || 3000;
app.listen(port,host, function() {
  console.log("Roomy is started!" + port);
});