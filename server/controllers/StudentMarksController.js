const AssignmentModel = require("../models/AssignmentModel");
const StudentAssignmentModel = require("../models/AssignmentSolutionsModel");
const UserModel = require("../models/userModel");
const mongoose = require("mongoose");

const saveStudentCode = async (req, res) => {
  const { assignmentId, code, language } = req.body;
  const studentId = req.user.userId;

  console.log(studentId)
  try {
    const filter = {
      StudentId: studentId,
      AssignmentId: assignmentId
    };

    const update = {
      $set: {
        Code: code,
        language: language,
        success : false,
        Marks : null
      }
    };

    const options = {
      new: true,
      upsert: true,
      runValidators: true 
    };

    const studentAssignment = await StudentAssignmentModel.findOneAndUpdate(
      filter,
      update,
      options
    );

    res.status(200).json({
      success: true,
      data: studentAssignment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error || "Internal server error",
    });
  }
};

const getAssignmentCode = async (req, res) => {
  const { assignmentId, studentId } = req.query;
  const role = req.user.role;
  const userId = role == "Educator" ? studentId : req.user.userId;
  try {
    const data = await StudentAssignmentModel.findOne({
      StudentId: userId,
      AssignmentId: assignmentId,
    });

    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: error || "Internal server error",
    });
  }
};

const getSubmissionsByClassCode = async (req, res) => {
  const { classCode } = req.query;
  try {
    const submissions = await StudentAssignmentModel.aggregate([
      {
        // Lookup AssignmentModel to get assignment details
        $lookup: {
          from: "Assignments", // Name of the collection for AssignmentModel
          localField: "AssignmentId",
          foreignField: "_id",
          as: "assignmentDetails",
        },
      },
      {
        // Unwind assignmentDetails array
        $unwind: "$assignmentDetails",
      },
      {
        // Match the classCode
        $match: {
          "assignmentDetails.classCode": classCode,
        },
      },
      {
        // Lookup UserModel to get student details
        $lookup: {
          from: "users", // Name of the collection for UserModel
          localField: "StudentId",
          foreignField: "_id",
          as: "studentDetails",
        },
      },
      {
        // Unwind studentDetails array
        $unwind: "$studentDetails",
      },
      {
        // Project the required fields
        $project: {
          _id: 0,
          studentId: "$studentDetails._id",
          assignmentId: "$assignmentDetails._id",
          studentName: {
            $concat: [
              "$studentDetails.firstName",
              " ",
              "$studentDetails.secondName",
            ],
          },
          assignmentTitle: "$assignmentDetails.title",
          marks: "$Marks",
        },
      },
    ]);

    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error || "Internal server error",
    });
  }
};

const addMarks = async (req, res) => {
  const { studentId, marks, assignmentId } = req.body;

  try {
    const updatedDocument = await StudentAssignmentModel.findOneAndUpdate(
      { StudentId: studentId, AssignmentId : assignmentId },
      { $set: { Marks: marks } },
      { new: true }
    );

    res.status(200).json(updatedDocument);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error || "Internal server error",
    });
  }
};

module.exports = {
  saveStudentCode,
  getAssignmentCode,
  getSubmissionsByClassCode,
  addMarks,
};
