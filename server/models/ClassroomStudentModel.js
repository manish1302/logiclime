const mongoose = require("mongoose");

const ClassroomStudentModel = mongoose.Schema(
  {
    StudentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
      required: true,
    },
    ClassCode: {
      type: String,
      required: true,
    },
  },
  {
    collection: "ClassroomStudent",
    timestamps: true,
  }
);

module.exports = mongoose.model("ClassroomStudentModel", ClassroomStudentModel);
