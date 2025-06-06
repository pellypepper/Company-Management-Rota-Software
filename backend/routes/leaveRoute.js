
const express = require('express');
const router = express.Router();
const { getleave, requestleave, approveLeave, declineleave, deleteLeave, staffLeave } = require('../controller/leaveController');


router.get('/', getleave);
  
  
  router.post('/request/:id', requestleave);
  
  router.get('/staff/:id', staffLeave)
  
  
  
  
  
  
  
  router.put('/approve/:id', approveLeave);
  router.put('/decline/:id', declineleave);
  
  
  router.delete('/delete/:id', deleteLeave);



  module.exports = router;
  
