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
    }
  },
  {
    collection: "Classroom",
    timestamps: true,
  }
);


module.exports = mongoose.model('ClassroomModel', ClassroomSchema);