const ENV = require("dotenv");
ENV.config();

var moment = require("moment");

var express = require("express");
var app = express();
app.use(express.static("static"));
app.set("view engine", "ejs");

var mongoose = require("mongoose");
var bp = require("body-parser");
var expressSanitizer = require("express-sanitizer");
var methodOverride = require("method-override");

var passport = require("passport");
var localStrategy = require("passport-local");
var User = require("./models/user.js");
require("./models/posts.js");
require("./models/comments.js");

var commentRoutes = require("./routes/comments");
var postRoutes = require("./routes/posts");
var indexRoutes = require("./routes/index");

var dbURL =
  "mongodb+srv://" +
  process.env.uname +
  ":" +
  process.env.password +
  "@cluster0-ji2ke.azure.mongodb.net?retryWrites=true&w=majority";

// Just for serverless function platform deployments
let isConnected = false;
async function connectToDatabase() {
  try {
    await mongoose.connect(dbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("Connected to database");
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
}

app.use((req, res, next) => {
  if (!isConnected) {
    connectToDatabase();
  }
  next();
});

// For deployment to non serverless platforms
// mongoose.connect(dbURL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useCreateIndex: true,
// });

mongoose.connection.on("connected", function () {
  console.log("Connected to production database");
});

mongoose.connection.on("error", function (err) {
  console.error("Error connecting to production database:", err);
});

app.use(bp.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(expressSanitizer());
// seed()

//====================PASSPORT CONFIG===============================
app.use(
  require("express-session")({
    secret: "IROC",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use(indexRoutes);
app.use(postRoutes);
app.use(commentRoutes);

app.listen(process.env.PORT, () => {
  console.log(`server started at port ${process.env.PORT}`);
});

module.exports = app;
