const ClassroomModel = require("../models/ClassroomModel");
const userModel = require("../models/userModel");
const AssignmentModel = require("../models/AssignmentModel");

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
      _id: educatorId,
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

module.exports = {
  createClassroom,
  getClassroomsById,
  getClassroomByCode,
  getClassroomByEducatorId,
};
