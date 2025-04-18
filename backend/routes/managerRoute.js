
const express = require('express');
const router = express.Router();
const { getManager, getManagerInfo } = require('../controller/managerController');


  

router.get('/', getManager);
  
  
  router.get('/info', getManagerInfo);
  


  module.exports = router;
  