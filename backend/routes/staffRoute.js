
const express = require('express');
const router = express.Router();

const { getStaff, getTimeSheet, allInfo } = require('../controller/staffController');


  
  router.get('/:id/next-shift', nextShift);
  

router.get('/', getStaff);
  
  router.get('/timesheet', getTimeSheet);
  router.get('/all', allInfo);
  


  module.exports = router;
  