const mongoose = require("mongoose");

const AssignmentSchema = mongoose.Schema(
  {
    educator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
      required: true,
    },
    classCode: {
      type: String,
      required: true,   
    },
    title: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    functionSignature: {
      type: String,
    },
    constraints: {
      type: String,
    },
    testCases: {
      type: Array,
      required: true,
    },
  },
  {
    collection: "Assignments",
    timestamps: true,
  }
);

module.exports = mongoose.model("AssignmentModel", AssignmentSchema);
