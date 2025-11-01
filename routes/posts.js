var express = require("express");
var router = express.Router();
var Post = require("../models/posts");
var Comment = require("../models/comments");
var User = require("../models/user");

router.get("/posts", (req, res) => {
  console.log("GET /posts - Fetching all posts");
  //GET POSTS FROM DB
  Post.find({}, (error, itemReturned) => {
    if (error) {
      console.error("Error fetching posts:", error);
      res.redirect("back");
    } else {
      res.render("posts/posts", { posts: itemReturned });
    }
  });
});

router.post("/posts", isLoggedIn, (req, res) => {
  console.log("POST /posts - Creating a new post");
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
  console.log("New post data:", newEntry);
  // CREATE A NEW POST IN DB
  Post.create(newEntry, (error, itemReturned) => {
    if (error) {
      console.error("Error creating post:", error);
    } else console.log("New Post Created.");
  });
  res.redirect("/posts");
});

router.get("/posts/add", isLoggedIn, (req, res) => {
  console.log("GET /posts/add - Rendering new post form");
  res.render("posts/new");
});

router.get("/posts/:id", (req, res) => {
  console.log(`GET /posts/${req.params.id} - Fetching post`);
  Post.findById(req.params.id)
    .populate("comments")
    .exec((error, itemReturned) => {
      if (error) {
        console.error("Error fetching post:", error);
        res.redirect("/posts");
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
  console.log(`GET /posts/${req.params.id}/edit - Rendering edit form`);
  Post.findById(req.params.id, (error, itemReturned) => {
    if (error) {
      console.error("Error fetching post for edit:", error);
      res.redirect("/posts");
    } else {
      res.render("posts/edit", { editPost: itemReturned });
    }
  });
});

router.put("/posts/:id", actionAuth, (req, res) => {
  console.log(`PUT /posts/${req.params.id} - Updating post`);
  console.log("Update data:", req.body.updateData);
  Post.findByIdAndUpdate(
    req.params.id,
    req.body.updateData,
    (error, itemReturned) => {
      if (error) {
        console.error("Error updating post:", error);
      }
      res.redirect("/posts/" + req.params.id);
    }
  );
});

//========================DELETE Route=================
router.delete("/posts/:id", actionAuth, (req, res) => {
  console.log(`DELETE /posts/${req.params.id} - Deleting post`);
  Post.findById(req.params.id, (error, itemReturned) => {
    if (error) {
      console.error("Error finding post to delete:", error);
      res.redirect("/posts");
    } else {
      itemReturned.comments.forEach((value, index, array) => {
        Comment.findByIdAndDelete(value, (error) => {
          if (error) {
            console.error("Error deleting comment:", error);
          }
        });
      });
      itemReturned.deleteOne();
      console.log("Post deleted successfully");
      res.redirect("/posts");
    }
  });
});

router.get("/userprofile/:id", isLoggedIn, (req, res) => {
  console.log(`GET /userprofile/${req.params.id} - Fetching user profile`);
  User.findById(req.params.id, (error, ir) => {
    if (error) {
      console.error("Error fetching user profile:", error);
      res.redirect("back");
    } else {
      Post.find({ "author.id": req.params.id }, (error, irPosts) => {
        if (error) {
          console.error("Error fetching user posts:", error);
          res.redirect("back");
        } else {
          if (req.params.id === "5dc8f136e53c1f1d847bd643") {
            User.find({}, (error, allusers) => {
              if (error) {
                console.error("Error fetching all users:", error);
                res.redirect("back");
              } else {
                res.render("posts/profile.ejs", {
                  userDetails: irPosts,
                  user: ir,
                  userlist: allusers,
                });
              }
            });
          } else {
            res.render("posts/profile.ejs", {
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
  console.log(`GET /user/destroy/${req.params.id} - Deleting user and posts`);
  Post.find({ "author.id": req.params.id }, (error, ir) => {
    if (error) {
      console.error("Error finding user's posts to delete:", error);
    } else {
      ir.forEach((value) => {
        value.deleteOne();
      });
      console.log("User's posts deleted successfully");
    }
  });
  User.findByIdAndRemove(req.params.id, (error, ir) => {
    if (error) {
      console.error("Error deleting user:", error);
      res.redirect("back");
    } else {
      console.log("User deleted successfully");
      res.redirect("back");
    }
  });
});

router.post("/search", isLoggedIn, (req, res) => {
  console.log(`POST /search - Searching for user: ${req.body.user}`);
  Post.find({ "author.username": req.body.user }, (error, ir) => {
    if (error) {
      console.error("Error searching for user:", error);
      res.redirect("/posts");
    } else {
      res.render("posts/searchtemplate", {
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
    Post.findById(req.params.id, (error, itemReturned) => {
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
