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
  getClassroomByStudentId,
} = require("../controllers/classroomController.js");

router.post("/createClass", authenticate, createClassroom);

router.get("/getAllClassroomsById", authenticate, getClassroomsById);

router.get("/getClassroomByCode", authenticate, getClassroomByCode);

router.get("/getClassroomByEducatorId", authenticate, getClassroomByEducatorId);
router.get("/getClassroomByStudentId", authenticate, getClassroomByStudentId);
router.get("/getStudentsByClassCode", authenticate, getStudentByClassCode);
router.post("/joinClassroom", authenticate, joinClassroom);

module.exports = router;
