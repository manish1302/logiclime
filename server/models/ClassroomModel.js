const mongoose = require("mongoose");

const ClassroomSchema = mongoose.Schema(
  {
    educator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    classCode: {
      type: String,
      unique: true,
      required: true,
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
      },
    ],
    assignments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AssignmentModel",
      },
    ],
    notes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "NotesModel",
      },
    ],
  },
  {
    collection: "Classroom",
    timestamps: true,
  }
);


module.exports = mongoose.model('ClassroomModel', ClassroomSchema);