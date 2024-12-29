const mongoose = require("mongoose");

const StudentMarksModel = mongoose.Schema(
  {
    StudentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
      required: true,
    },
    // EducatorId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "UserModel",
    //   required: true,
    // },
    AssignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AssignmentModel",
      required: true,
    },
    language : {
      type : String,
      required : true
    },
    Code: {
      type: String,
      required: true,
    },
    Marks: {
      type: Number,
    },
    Remarks: {
      type: String,
    },
    Success: {
      type: Boolean,
      required: true,
    },
  },
  {
    collection: "StudentMarks",
    timestamps: true,
  }
);

module.exports = mongoose.model("StudentMarksModel", StudentMarksModel);
