const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/AuthenticateJWT.js");
const {
  createClassroom,
  getClassroomsById,
  getClassroomByCode,
  getClassroomByEducatorId,
  getStudentByClassCode,
  joinClassroom,
} = require("../controllers/classroomController.js");

router.post("/createClass", authenticate, createClassroom);

router.get("/getAllClassroomsById", authenticate, getClassroomsById);

router.get("/getClassroomByCode", authenticate, getClassroomByCode);

router.get("/getClassroomByEducatorId", authenticate, getClassroomByEducatorId);
router.get("/getStudentsByClassCode", authenticate, getStudentByClassCode);
router.post("/joinClassroom", authenticate, joinClassroom);

module.exports = router;
