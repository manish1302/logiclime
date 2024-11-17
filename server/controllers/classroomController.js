const ClassroomModel = require("../models/ClassroomModel");

const createClassroom = async (req, res) => {
    const { Name, Description } = req.body;
    try {
        var classCode;

        while(true) {
            classCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            let found = await ClassroomModel.find({classCode}); 
            if(found?.length == 0) {
                break;
            }
        }

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
    const Classroom = await ClassroomModel.findOne({educator : educatorId});
    res.status(200).json({success: true, classrooms : Classroom});
}

module.exports = {
    createClassroom,
    getClassroomsById
}