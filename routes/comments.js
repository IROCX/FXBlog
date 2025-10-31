var express = require("express");
var router = express.Router();
var Post = require("../models/posts");
var Comment = require("../models/comments");

router.get("/posts/:id/comments/new", isLoggedIn, (req, res) => {
  Post.findById(req.params.id, (error, ir) => {
    if (error) {
      console.log("error");
    } else {
      res.render("comments/new", { post: ir });
    }
  });
});

router.post("/posts/:id/comments", isLoggedIn, (req, res) => {
  Post.findById(req.params.id, (error, irCFound) => {
    console.log(irCFound);
    if (error) {
      console.log("error");
      res.redirect("/posts");
    } else {
      Comment.create(req.body.comment, (error, ir) => {
        if (error) {
          console.log("error in creating comment");
        } else {
          //add user to comment
          ir.author.id = req.user._id;
          ir.author.username = req.user.username;
          ir.save();
          console.log("Self taken details : " + ir);
          irCFound.comments.push(ir);
          irCFound.save();
          res.redirect("/posts/" + irCFound._id);
        }
      });
    }
  });
});

router.get("/posts/:id/comments/:commentid/edit", commentAuth, (req, res) => {
  Comment.findById(req.params.commentid, (error, ir) => {
    if (error) {
      res.redirect("/posts/" + req.params.id);
    } else {
      console.log(ir);
      res.render("comments/edit", {
        editComment: ir,
        post_id: req.params.id,
      });
    }
  });
});

router.put("/posts/:id/comments/:commentid", commentAuth, (req, res) => {
  // console.log(req.body.text)
  Comment.findByIdAndUpdate(
    req.params.commentid,
    req.body.comment,
    (error, ir) => {
      if (error) {
        console.log("error in updating comment");
      } else {
        console.log("comment updated successfully" + ir);
        res.redirect("/posts/" + req.params.id);
      }
    }
  );
});

router.delete("/posts/:id/comments/:commentid", commentAuth, (req, res) => {
  Comment.findByIdAndDelete(req.params.commentid, (error) => {
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
