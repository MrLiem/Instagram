const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../keys");
const requireLogin= require('../middleware/requireLogin')

router.get("/protected",requireLogin, (req, res) => {
  res.send("Hello");
});

router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
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
          const user = new User({ email, password: hashedPassword, name });
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
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(422).json({ message: "Please add all the fields!!!" });
  }
  User.findOne({ email })
    .then((savedUser) => {
      if (!savedUser) {
        return res.status(422).json({ message: "Invalid email!!!" });
      }
      bcryptjs
        .compare(password, savedUser.password)
        .then((doMatch) => {
          if (doMatch) {
             //return res.json({ message: "Signin Successfully!!!" });
            const token = jwt.sign({_id:savedUser._id}, JWT_SECRET);
            return res.json({token});
          } else {
            return res.status(422).json({ message: "Invalid password!!!" });
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
