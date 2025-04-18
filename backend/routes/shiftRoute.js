
const express = require('express');
const router = express.Router();
const { getAllShifts, addShift, getDate, getStaff, deleteShift } = require('../controller/shiftController');

router.get('/', getAllShifts);
  
  

  router.post('/addShift', addShift);

  router.get("/date/:date", getDate);
  
  router.get('/staff/:id', getStaff);
  router.delete('/delete/:id',  deleteShift);
  


  module.exports = router;
