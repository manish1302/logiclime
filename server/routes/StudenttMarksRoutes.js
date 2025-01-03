const express = require('express');

const router = express.Router();


const {saveStudentCode, getAssignmentCode, getSubmissionsByClassCode, addMarks, getAssignmentMarks} = require('../controllers/StudentMarksController');
const authenticate = require('../middlewares/AuthenticateJWT');


router.post('/saveStudentCode', authenticate, saveStudentCode);
router.get('/getAssignmentCode', authenticate, getAssignmentCode);

router.get('/getSubmissionsByClassCode', authenticate, getSubmissionsByClassCode)

router.post('/addMarks', authenticate, addMarks);
router.get('/getAssignmentMarks', authenticate, getAssignmentMarks)


module.exports = router