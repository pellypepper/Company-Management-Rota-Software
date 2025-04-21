const { login, register, activateToken, logout } = require('../controller/authController');

const express = require('express');
const router = express.Router();



router.post('/login', login )

router.post('/register', register);

router.get('/activate/:token',  activateToken);

      router.post('/logout', logout);
      

module.exports = router;