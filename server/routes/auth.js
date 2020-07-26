const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const requireLogin = require("../middleware/requireLogin");

//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
router.post("/signup", (req, res) => {
  const { name, email, password,picture } = req.body;
  if (!email || !password || !name) {
    return res.status(422).json({ error: "please add all the fields" });
  }

  User.findOne({ email })
    .then((savedUser) => {
      if (savedUser)
        return res.status(422).json({ error: "Email is already exist" });

      bcryptjs
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({ email, password: hashedPassword, name,picture });
          user
            .save()
            .then((user) => {
              res.status(200).json({ message: "Saved successfully!!!" });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ message: "Please add all the fields!!!" });
  }
  User.findOne({ email })
    .then((savedUser) => {
      if (savedUser === null) {
        return res.status(422).json({ error: "Invalid email!!!" });
      }
      bcryptjs
        .compare(password, savedUser.password)
        .then((doMatch) => {
          if (doMatch) {
            const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
            const { _id, name, email,followers,followings,picture } = savedUser;
            return res.json({ token, user: { _id, name, email,followers,followings,picture } });
          } else {
            return res.status(422).json({ error: "Invalid password!!!" });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});
module.exports = router;
