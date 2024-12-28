const express = require('express');

const router = express.Router();


const {saveStudentCode, getAssignmentCode} = require('../controllers/StudentMarksController');
const authenticate = require('../middlewares/AuthenticateJWT');


// router.post('/saveStudentCode', authenticate, saveStudentCode);
router.get('/getAssignmentCode', authenticate, getAssignmentCode)


module.exports = router