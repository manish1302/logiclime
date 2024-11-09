const express = require('express');
const router = express.Router();

const {createUser, getAllUsers, createDummyUser, login} = require('../controllers/loginController.js');
const authenticate = require('../middlewares/AuthenticateJWT.js');

router.post('/register', createUser);
router.get('/', authenticate, getAllUsers);
router.post('/dummy', createDummyUser);
router.post('/login', login);

module.exports = router;