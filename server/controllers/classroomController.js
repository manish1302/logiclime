const ClassroomModel = require("../models/ClassroomModel");
const userModel = require("../models/userModel");
const AssignmentModel = require("../models/AssignmentModel");
const ClassroomStudentModel = require("../models/ClassroomStudentModel");

const createClassroom = async (req, res) => {
  const { Name, Description } = req.body;
  try {
    var classCode;

    while (true) {
      classCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      let found = await ClassroomModel.find({ classCode });
      if (found?.length == 0) {
        break;
      }
    }

    const newClassroom = new ClassroomModel({
      educator: req.user.userId,
      name: Name,
      description: Description,
      classCode,
    });

    await newClassroom.save();
    res.status(200).json({
      success: true,
      classroom: newClassroom,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

const getClassroomsById = async (req, res) => {
  const educatorId = req.user.userId;
  const Classroom = await ClassroomModel.findOne({ educator: educatorId });

  res.status(200).json({ success: true, classrooms: Classroom });
};

const getClassroomByCode = async (req, res) => {
  try {
    const classCode = req.query.classCode;
    const educatorId = req.user.userId;
    const Classroom = await ClassroomModel.findOne({ classCode });
    const Educator = await userModel.findOne({
      _id: Classroom.educator,
    });
    res
      .status(200)
      .json({ success: true, classroom: Classroom, educator: Educator });
  } catch (error) {
    console.log(err);
  }
};

const getClassroomByEducatorId = async (req, res) => {
  const educatorId = req.user.userId;

  try {
    const data = await ClassroomModel.find({ educator: educatorId });
    const updatedData = await Promise.all(
      data.map(async (item) => {
        const assignmentCount = await AssignmentModel.countDocuments({
          classCode: item.classCode,
        });
        return {
          ...item,
          assignmentCount,
        };
      })
    );
    res.status(200).json({
      success: true,
      data: updatedData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
    });
  }
};

const getClassroomByStudentId = async (req, res) => {
  const userId = req.user.userId;

  try {
    const studentClasses = await ClassroomStudentModel.find({ StudentId: userId }).select("ClassCode");

    const classCodes = studentClasses.map((entry) => entry.ClassCode);

    if (classCodes.length === 0) {
      console.log("No classes found for this student.");
      return [];
    }

    // Step 2: Fetch class details and assignment counts
    const classroomDetails = await ClassroomModel.aggregate([
      {
        $match: { classCode: { $in: classCodes } }, // Filter by class codes
      },
      {
        $lookup: {
          from: "Assignments", // Name of the Assignment collection
          localField: "classCode",
          foreignField: "classCode",
          as: "assignments",
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          classCode : 1,
          numberOfAssignments: { $size: "$assignments" },
        },
      },
    ]);

    res.status(200).json(classroomDetails)
  } catch (error) {
    res.status(500).json({
      success: false,
    });
  }
}

const getStudentByClassCode = async (req, res) => {
  const { classCode } = req.query;

  try {
    const data = await ClassroomStudentModel.aggregate([
      {
        $match: { ClassCode: classCode },
      },
      {
        $lookup: {
          from: "users",
          localField: "StudentId",
          foreignField: "_id",
          as: "studentDetails",
        },
      },
      {
        $unwind: "$studentDetails",
      },
      {
        $project: {
          _id: 0,
          name: {
            $concat: [
              "$studentDetails.firstName",
              " ",
              "$studentDetails.secondName",
            ],
          },
          email: "$studentDetails.email",
        },
      },
    ]);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      success: false,
      data: error || "Internal server error",
    });
  }
};

const joinClassroom = async (req, res) => {
  const { code } = req.body;
  const userId = req.user.userId;
  const role = req.user.role;

  if(role === "Educator") {
    return;
  }

  try {
    const existingStudent = await ClassroomStudentModel.findOne({
      StudentId: userId,
      ClassCode: code,
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Student is already enrolled in this classroom.",
      });
    }

    const StudentClassroom = new ClassroomStudentModel({
      StudentId: userId,
      ClassCode: code,
    });

    await StudentClassroom.save();

    res.status(200).json(StudentClassroom);
  } catch (error) {
    res.status(500).json({
      success: false,
      data: error || "Internal server error",
    });
  }
};

module.exports = {
  createClassroom,
  getClassroomsById,
  getClassroomByCode,
  getClassroomByEducatorId,
  getStudentByClassCode,
  joinClassroom,
  getClassroomByStudentId
};
