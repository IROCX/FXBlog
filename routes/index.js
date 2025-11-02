var express = require("express");
var router = express.Router();

var passport = require("passport");
var User = require("../models/user");

router.get("/", (req, res) => {
  res.redirect("/posts");
});

router.get("/about", (req, res) => {
  res.render("about");
});

//==================AUTH ROUTES===============================

router.get("/login", (req, res) => {
  res.render("forms/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/posts",
    failureRedirect: "/login",
  }),
  (req, res) => {
    console.log("User logged in:", req.user.username);
  }
);

router.get("/logout", (req, res) => {
  console.log("User logged out:", req.user.username);
  req.logOut();
  res.redirect("/login");
});

router.get("/register", (req, res) => {
  res.render("forms/register");
});
router.post("/register", (req, res) => {
  var newUser = new User({
    username: req.body.username,
    name: req.body.name,
    contact: req.body.contact,
    email: req.body.email,
  });
  console.log("Attempting to register new user:", req.body.username);
  User.register(newUser, req.body.password, (error, ir) => {
    if (error) {
      console.error("Error registering user:", error);
      return res.render("forms/register");
    }
    passport.authenticate("local")(req, res, () => {
      console.log("User registered and authenticated:", ir.username);
      res.redirect("/posts");
    });
  });
});

module.exports = router;
