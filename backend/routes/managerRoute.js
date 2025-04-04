
const express = require('express');
const router = express.Router();
const pool = require('../db'); 


  

router.get('/', async (req, res) => {
    try {
      const managers = await pool.query('SELECT * FROM manager');
      res.json(managers.rows);
    } catch (error) {
      console.error('Error fetching managers:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  
  router.get('/info', async (req, res) => {
    try {
      const query = `
        SELECT 
          mr.pay AS pay, 
          mr.position AS position, 
          m.role AS role, 
          m.name AS name, 
          m.email AS email, 
          m.address AS address
        FROM manager m 
        JOIN managerrole mr ON m.id = mr.staff_id
      `;
      
      const result = await pool.query(query);
      
  
      if (result.rows.length === 0) {
        return res.json({ message: 'No managers found' });
      }
  
      res.status(200).json(result.rows);
    } catch (error) {
      
      res.status(500).json({ message: 'Internal server error', error: error.message }); 
    }
  });
  


  module.exports = router;
  