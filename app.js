var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy   = require("passport-local"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds");
    // Comment     = require("./models/comments")

//REQUIRING ROUTES
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");


mongoose.connect("mongodb://localhost/yelp_camp_v8"); //create yelpcamp db inside mongodb
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
// Seed the database
// seedDB();


//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "eat shit",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //passport authenticate middleware
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next(); //to move to next middleware
});

//INCLUDING OTHER ROUTES IN SEPARATE FILES
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes); //it appends /campgrounds infront of all routes
app.use("/campgrounds/:id/comments", commentRoutes);



app.listen(3000, function(){
    console.log("YelpCamp server has started!");
});
