const AssignmentModel = require("../models/AssignmentModel");

const saveAssignment = async (req, res) => {
  const {
    classCode,
    title,
    difficulty,
    tags,
    description,
    functionSignature,
    constraints,
    testCases,
  } = req.body;

  try {
    const Assignment = new AssignmentModel({
      educator: req.user.userId,
      classCode,
      title,
      difficulty,
      tags,
      description,
      functionSignature,
      constraints,
      testCases,
    });

    Assignment.save();

    res.status(200).json({
      success: true,
      message: Assignment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error || "Internal server error",
    });
  }
};

const getAssignments = async (req, res) => {
  const { classCode } = req.query;
  try {
    const Assignments = await AssignmentModel.find({ classCode: classCode });
    res.status(200).json({
      success: true,
      message: Assignments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error || "Internal server error",
    });
  }
};

const getAssignmentById = async (req, res) => {
  const { Id } = req.query;
  try {
    const assignment = await AssignmentModel.findOne({ _id: Id });

    res.status(200).json({
      success: true,
      message: assignment,
    });
  } catch (error) {
    console.log(error);
  }
};

const getAssignmentsByClassCode = async (req, res) => {
  const { Id } = req.query;
  try {
    const result = await AssignmentModel.aggregate([
      {
        $match: { classCode : Id }, // Filter assignments by the provided classCode
      },
      {
        $lookup: {
          from: "StudentMarks", // The collection name for StudentMarksModel
          localField: "_id", // The field in AssignmentModel
          foreignField: "AssignmentId", // The field in StudentMarksModel
          as: "studentSubmissions", // Alias for the joined data
        },
      },
      {
        $addFields: {
          studentCount: { $size: "$studentSubmissions" }, // Count the number of submissions
        },
      },
      {
        $project: {
          _id: 0, // Exclude the `_id` field
          title: 1, // Include the title
          difficulty: 1, // Include the difficulty
          tags: 1, // Include the tags
          studentCount: 1, // Include the student count
        },
      },
    ]);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error || "Internal Server Error",
    });
  }
};

module.exports = {
  saveAssignment,
  getAssignments,
  getAssignmentById,
  getAssignmentsByClassCode,
};
