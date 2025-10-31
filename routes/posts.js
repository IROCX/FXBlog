var express = require("express");
var router = express.Router();
var Post = require("../models/posts");
var Comment = require("../models/comments");
var User = require("../models/user");

router.get("/posts", (req, res) => {
  //GET POSTS FROM DB
  Post.find({}, (error, itemReturned) => {
    if (error) console.log(error);
    else {
      res.render("posts/posts", { posts: itemReturned });
    }
  });
});

router.post("/posts", isLoggedIn, (req, res) => {
  var name = req.body.name;
  var image = req.body.image;
  req.body.desc = req.sanitize(req.body.desc);
  var description = req.body.desc;
  var author = {
    id: req.user._id,
    username: req.user.username,
  };
  var newEntry = {
    name: name,
    image: image,
    description: description,
    author: author,
  };
  console.log(newEntry);
  // CREATE A NEW POST IN DB
  Post.create(newEntry, (error, itemReturned) => {
    if (error) {
      console.log(error);
    } else console.log("New Post Created.");
  });
  res.redirect("/posts");
});

router.get("/posts/add", isLoggedIn, (req, res) => {
  res.render("posts/new");
});

router.get("/posts/:id", (req, res) => {
  Post.findById(req.params.id)
    .populate("comments")
    .exec((error, itemReturned) => {
      if (error) {
        console.log(error);
      } else {
        res.render("posts/show", {
          foundPost: itemReturned,
          SECRET_id: process.env.secret_id,
        });
      }
    });
});

//====================Edit Route=================
router.get("/posts/:id/edit", actionAuth, (req, res) => {
  Post.findById(req.params.id, (error, itemReturned) => {
    res.render("posts/edit", { editPost: itemReturned });
  });
});

router.put("/posts/:id", actionAuth, (req, res) => {
  console.log(req.body.updateData.desc);
  Post.findByIdAndUpdate(
    req.params.id,
    req.body.updateData,
    (error, itemReturned) => {
      if (error) {
        console.log("Error updating post");
      }
      res.redirect("/posts/" + req.params.id);
    }
  );
});

//========================DELETE Route=================
router.delete("/posts/:id", actionAuth, (req, res) => {
  Post.findById(req.params.id, (error, itemReturned) => {
    if (error) {
      console.log(error);
    } else {
      itemReturned.comments.forEach((value, index, array) => {
        Comment.findByIdAndDelete(value, (error) => {});
      });
      itemReturned.deleteOne();
      res.redirect("/posts");
    }
  });
});

router.get("/userprofile/:id", isLoggedIn, (req, res) => {
  User.findById(req.params.id, (error, ir) => {
    if (error) {
      console.log("error==============================");
    } else {
      Campground.find({ "author.id": req.params.id }, (error, irPosts) => {
        if (error) console.log("error");
        else {
          if (req.params.id === "5dc8f136e53c1f1d847bd643") {
            User.find({}, (error, allusers) => {
              if (error) {
                console.log("error");
              } else {
                res.render("campgrounds/profile.ejs", {
                  userDetails: irPosts,
                  user: ir,
                  userlist: allusers,
                });
                console.log(allusers);
              }
            });
          } else {
            res.render("campgrounds/profile.ejs", {
              userDetails: irPosts,
              user: ir,
            });
          }
        }
      });
    }
  });
});

router.get("/user/destroy/:id", isLoggedIn, (req, res) => {
  Campground.find({ "author.id": req.params.id }, (error, ir) => {
    if (error) {
      console.log("error in deleting users campgrounds");
    } else {
      // console.log('user to be deleted' + ir)
      ir.forEach((value) => {
        value.deleteOne();
      });
    }
  });
  User.findByIdAndRemove(req.params.id, (error, ir) => {
    if (error) {
      res.redirect("back");
    } else {
      res.redirect("back");
    }
  });
});

router.post("/search", isLoggedIn, (req, res) => {
  Campground.find({ "author.username": req.body.user }, (error, ir) => {
    if (error) {
      res.redirect("/campgrounds");
    } else {
      res.render("campgrounds/searchtemplate", {
        searchedUser: ir,
        searchKey: req.body.user,
      });
    }
  });
});

//=================MIDDLEWARE====================
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function actionAuth(req, res, next) {
  if (req.isAuthenticated()) {
    //if login then check if its the author of the post
    Campground.findById(req.params.id, (error, itemReturned) => {
      if (error) {
        console.log(error);
        res.redirect("back");
      } else {
        if (
          itemReturned.author.id.equals(req.user._id) ||
          req.user._id.equals("5dc8f136e53c1f1d847bd643")
        ) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
}

module.exports = router;
