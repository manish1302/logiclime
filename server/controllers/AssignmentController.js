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
      
      { $match: { Id } },

    
      {
        $lookup: {
          from: "StudentMarks", 
          localField: "_id", 
          foreignField: "AssignmentId", 
          as: "studentSubmissions",
        },
      },


      { $unwind: "$studentSubmissions" },

     
      {
        $lookup: {
          from: "users",
          localField: "studentSubmissions.StudentId", 
          foreignField: "_id", 
          as: "studentDetails",
        },
      },

      
      { $unwind: "$studentDetails" },

     
      {
        $group: {
          _id: "$_id", 
          assignmentTitle: { $first: "$title" },
          assignmentTags: { $first: "$tags" },
          difficulty: { $first: "$difficulty" },
          students: { $addToSet: "$studentDetails.firstName" }, 
        },
      },

     
      {
        $project: {
          _id: 0,
          assignmentTitle: 1,
          assignmentTags: 1,
          difficulty: 1,
          students: 1,
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
