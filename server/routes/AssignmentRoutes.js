const express = require('express');
const authenticate = require('../middlewares/AuthenticateJWT');
const { getAssignments, saveAssignment, getAssignmentById, getAssignmentsByClassCode } = require('../controllers/AssignmentController');
const router = express.Router();

router.get("/getAssignments", authenticate, getAssignments);
router.post("/saveAssignments", authenticate, saveAssignment);
router.get("/getAssignmentById", authenticate, getAssignmentById);
router.get("/getAssignmentByClassCode", authenticate, getAssignmentsByClassCode)


module.exports = router;