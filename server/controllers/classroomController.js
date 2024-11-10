const ClassroomModel = require("../models/ClassroomModel");

const createClassroom = async (req, res) => {
    const { Name, Description } = req.body;
    try {
        const classCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        console.log(classCode);
        const newClassroom = new ClassroomModel({
            educator : req.user.userId,
            name : Name, 
            description : Description,
            classCode
        })

        await newClassroom.save();
        res.status(200).json({
            success : true,
            classroom : newClassroom
        });
    } catch (error) {
        res.status(500).json({
            success : false,
            message : error
        });
    }
}

const getClassroomsById = async (req, res) => {
    const educatorId = req.user.userId;
    const Classrooms = await ClassroomModel.find({educator : educatorId});
    res.status(200).json({success: true, classrooms : Classrooms});
}

module.exports = {
    createClassroom,
    getClassroomsById
}