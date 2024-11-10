const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    secondName: {
      type: String,
    },
    email: {
      type: String,
      Unique : true,
    },
    password: {
      type: String,
    },
    role : {
      type : String,
      enum : ["Educator", "Student"],
      default : "User",
    }
  },
  {
    collection: "users",
    timestamps: true,
  }
);

//create a model of type userSchema and export
module.exports = mongoose.model("UserModel", userSchema);
