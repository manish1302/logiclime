const StudentAssignmentModel = require("../models/AssignmentSolutionsModel");

const saveStudentCode = (req, res) => {
  const { assignmentId, code, language} = req.body;
  const studentId = req.user.userId;
  try {
    const studentAssignment = new StudentAssignmentModel({
      StudentId: studentId,
      AssignmentId: assignmentId,
      Code: code,
      Success: false,
      language : language
    });

    studentAssignment.save();

    res.status(200).json({
      success: true,
      data: studentAssignment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error || "Internal server error",
    });
  }
};

module.exports = {
  saveStudentCode,
};
