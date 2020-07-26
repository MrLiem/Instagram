const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  picture:{
    type:String,
    default: "https://res.cloudinary.com/mrliem0862144900/image/upload/v1595589460/Who_is_it_kdeuqn.png"
  },
  followings: [{ type: ObjectId, ref: "User" }],
  followers: [{ type: ObjectId, ref: "User" }],
});

mongoose.model("User", userSchema);
