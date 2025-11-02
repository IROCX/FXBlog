var express = require("express");
var router = express.Router();
var Post = require("../models/posts");
var Comment = require("../models/comments");

router.get("/posts/:id/comments/new", isLoggedIn, (req, res) => {
  console.log(`GET /posts/${req.params.id}/comments/new - Rendering new comment form`);
  Post.findById(req.params.id, (error, ir) => {
    if (error) {
      console.error("Error fetching post for new comment:", error);
      res.redirect("back");
    } else {
      res.render("comments/new", { post: ir });
    }
  });
});

router.post("/posts/:id/comments", isLoggedIn, (req, res) => {
  console.log(`POST /posts/${req.params.id}/comments - Creating a new comment`);
  Post.findById(req.params.id, (error, irCFound) => {
    if (error) {
      console.error("Error finding post to add comment to:", error);
      res.redirect("/posts");
    } else {
      Comment.create(req.body.comment, (error, ir) => {
        if (error) {
          console.error("Error creating comment:", error);
          res.redirect("back");
        } else {
          //add user to comment
          ir.author.id = req.user._id;
          ir.author.username = req.user.username;
          ir.save();
          console.log("Comment created:", ir);
          irCFound.comments.push(ir);
          irCFound.save();
          res.redirect("/posts/" + irCFound._id);
        }
      });
    }
  });
});

router.get("/posts/:id/comments/:commentid/edit", commentAuth, (req, res) => {
  console.log(`GET /posts/${req.params.id}/comments/${req.params.commentid}/edit - Rendering edit comment form`);
  Comment.findById(req.params.commentid, (error, ir) => {
    if (error) {
      console.error("Error fetching comment for edit:", error);
      res.redirect("/posts/" + req.params.id);
    } else {
      res.render("comments/edit", {
        editComment: ir,
        post_id: req.params.id,
      });
    }
  });
});

router.put("/posts/:id/comments/:commentid", commentAuth, (req, res) => {
  console.log(`PUT /posts/${req.params.id}/comments/${req.params.commentid} - Updating comment`);
  Comment.findByIdAndUpdate(
    req.params.commentid,
    req.body.comment,
    (error, ir) => {
      if (error) {
        console.error("Error updating comment:", error);
        res.redirect("back");
      } else {
        console.log("Comment updated successfully");
        res.redirect("/posts/" + req.params.id);
      }
    }
  );
});

router.delete("/posts/:id/comments/:commentid", commentAuth, (req, res) => {
  console.log(`DELETE /posts/${req.params.id}/comments/${req.params.commentid} - Deleting comment`);
  Comment.findByIdAndDelete(req.params.commentid, (error) => {
    if (error) {
      console.error("Error deleting comment:", error);
    }
    res.redirect("/posts/" + req.params.id);
  });
});

function commentAuth(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.commentid, (error, itemReturned) => {
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
    console.log("login please.................................");
    res.redirect("back");
  }
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
