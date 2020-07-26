const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model("Post");
const User = mongoose.model("User");

router.get("/user/:id", requireLogin, (req, res) => {
  User.findOne({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      Post.find({ postedBy: req.params.id })
        .populate("postedBy", "_id name")
        .exec((err, posts) => {
          if (err) {
            return res.status(422).json({ error: err });
          }
          res.json({ user, posts });
        });
    })
    .catch((err) => {
      return res.status(404).json({ error: "User not found!!!" });
    });
});

router.put("/follow", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    {
      $push: { followers: req.user._id },
    },
    {
      new: true,
      useFindAndModify: false,
    }
  )
    .select("-password")
    .exec((err, result1) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { followings: req.body.followId },
        },
        {
          new: true,
          useFindAndModify: false,
        }
      )
        .select("-password")
        .then((result2) => {
          console.log(result2);
          res.json(result2);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    });
});

router.put("/unfollow", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    {
      $pull: { followers: req.user._id },
    },
    {
      new: true,
      useFindAndModify: false,
    }
  )
    .select("-password")
    .exec((err, result1) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { followings: req.body.followId },
        },
        {
          new: true,
          useFindAndModify: false,
        }
      )
        .select("-password")
        .then((result2) => {
          res.json(result2);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    });
});

router.put("/updatepic", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        picture: req.body.picture,
      },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: "picture cannot post!!!" });
      }
      res.json(result);
    }
  );
});
module.exports = router;
