const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/AuthenticateJWT.js');
const { createClassroom, getClassroomsById } = require('../controllers/classroomController.js');

router.post('/createClass', authenticate, createClassroom);

router.get('/getAllClassroomsById', authenticate, getClassroomsById);

module.exports = router;