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
        educator : req.user.userId,
        classCode,
        title,
        difficulty,
        tags,
        description,
        functionSignature,
        constraints,
        testCases
      })
    
      Assignment.save();
    
      res.status(200).json({
        success : true,
        message : Assignment
      })
  } catch (error) {
    res.status(500).json({
        success : false,
        message : error || "Internal server error"
    })
  }
};

const getAssignments = async (req, res) => {
    const {classCode} = req.body;
    console.log(classCode)
    try {
        AssignmentModel.find({classCode : classCode})
    } catch (error) {
        res.status(500).json({
            success : false,
            message : error || "Internal server error"
        })
    }
}

module.exports = {
    saveAssignment,
    getAssignments
}
