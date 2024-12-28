const express = require('express');

const router = express.Router();


const {saveStudentCode, getAssignmentCode, getSubmissionsByClassCode} = require('../controllers/StudentMarksController');
const authenticate = require('../middlewares/AuthenticateJWT');


router.post('/saveStudentCode', authenticate, saveStudentCode);
router.get('/getAssignmentCode', authenticate, getAssignmentCode);

router.get('/getSubmissionsByClassCode', authenticate, getSubmissionsByClassCode)


module.exports = router