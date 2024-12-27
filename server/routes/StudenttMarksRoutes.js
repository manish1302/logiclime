const express = require('express');

const router = express.Router();


const {saveStudentCode} = require('../controllers/StudentMarksController');
const authenticate = require('../middlewares/AuthenticateJWT');


router.post('/saveStudentCode', authenticate, saveStudentCode);


module.exports = router