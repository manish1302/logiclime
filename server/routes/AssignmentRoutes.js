const express = require('express');
const authenticate = require('../middlewares/AuthenticateJWT');
const { getAssignments, saveAssignment } = require('../controllers/AssignmentController');
const router = express.Router();

router.get("/getAssignments", authenticate, getAssignments);
router.post("/saveAssignments", authenticate, saveAssignment);

module.exports = router;