const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: [true, "email must be unique"],
      required: true,
    },
    blocked: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    blockedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    password: {
      type: String,
      required: true,
    },
    // usalai folow garna
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // usla follow garna
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    profile: {
      path: String,
      url: String,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamsps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.matchPassword = async function (password) {
  const wow = await bcrypt.compare(password, this.password);
  return wow;
};
userSchema.methods.getResetPasswordToken = async function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  console.log(resetToken,"forget")
  this.resetPasswordToken = crypto
  .createHash("sha256")
  .update(resetToken)
  .digest("hex");
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  console.log(this.resetPasswordToken)
  console.log(resetToken,"kmdkcmdkm")
  return resetToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
