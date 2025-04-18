

const express = require('express');
const router = express.Router();
const { addRole } = require('../controller/hrController');

router.post('/addrole', addRole);


  module.exports = router;