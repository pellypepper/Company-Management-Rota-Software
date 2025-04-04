
const express = require('express');
const router = express.Router();
const pool = require('../db'); 

router.get('/', async (req, res) => {
    try {
      const shifts = await pool.query(`
        SELECT s.id, s.date AS date, s.start_time AS shiftStart, s.end_time AS shiftEnd,
         st.name AS staffName
        FROM shifts s
        JOIN staff st ON s.staff_id = st.id
        ORDER BY s.date, s.start_time
      `);
      res.json(shifts.rows);
    } catch (error) {
     
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  

  router.post('/addShift', async (req, res) => {
    try {
      const { staffname, shiftDate, shiftStart, shiftEnd } = req.body;

      if (!staffname || !shiftDate || !shiftStart || !shiftEnd) {
        return res.status(400).json({ message: 'Please enter all fields' });
      }
  
  
  
 
      const staffResult = await pool.query(
        'SELECT id FROM staff WHERE name = $1',
        [staffname]
      );
     
  
      if (staffResult.rows.length === 0) {
        return res.status(400).json({ message: 'Staff member not found' });
      }
  
      const staffId = staffResult.rows[0].id;
  
  
  

      const newShift = await pool.query(
        'INSERT INTO shifts (staff_id, date, start_time, end_time) VALUES ($1, $2, $3, $4) RETURNING id',
        [staffId, shiftDate, shiftStart, shiftEnd]
      );
  
  

      if (newShift.rows.length === 0) {
        return res.status(500).json({ message: 'Failed to insert shift' });
      }
      const shift = {
        id: newShift.rows[0].id,
        staffname,
        date: shiftDate,
        start: shiftStart,
        end: shiftEnd
      }
  
      res.status(201).json({
        message: 'Shift added successfully',
        shift
      });
   
    } catch (error) {
  
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.get("/date/:date", async (req, res) => {
    const { date } = req.params;
  
    console.log("Received date:", date);
  

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      console.error("Invalid date format:", date);
      return res.status(400).send("Invalid date format. Use YYYY-MM-DD.");
    }
  
    try {
 
      const result = await pool.query(`SELECT s.id, s.staff_id AS staffId,
         s.date AS date ,s.start_time AS shiftstart, s.end_time AS shiftend,
          st.name AS staffname, mr.position AS position
          FROM shifts s
          JOIN staff st ON s.staff_id = st.id
          LEFT JOIN staffrole mr ON s.staff_id = mr.staff_id
           WHERE date = $1::DATE`, [date]);
      res.status(200).json(result.rows);
    } catch (error) {
  
      res.status(500).send("Internal Server Error");
    }
  });
  
  router.get('/staff/:id', async (req, res) => {
    const staffId = req.params.id; 
    try {
      const shifts = await pool.query(`
        SELECT s.id, s.date AS date, s.start_time AS shiftStart, s.end_time AS shiftEnd,
               st.name AS staffName, mr.position AS position
        FROM shifts s
        JOIN staff st ON s.staff_id = st.id
        LEFT JOIN staffrole mr ON s.staff_id = mr.staff_id
        WHERE s.staff_id = $1  -- This should be before ORDER BY
        ORDER BY s.date, s.start_time
      `, [staffId]);
   
      res.json(shifts.rows); 
    } catch (error) {
    
      res.status(500).json({ message: 'Internal server error' }); 
    }
  });
  router.delete('/delete/:id', async (req, res) => {
    const shiftId = req.params.id; 
  
    try {
  
      const id = parseInt(shiftId, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid shift ID format' });
      }
  
  
      const result = await pool.query('DELETE FROM shifts WHERE id = $1', [id]);
  
  
      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Shift not found' });
      }
  
     
      res.json({ message: 'Shift deleted successfully' });
    } catch (error) {
     
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  


  module.exports = router;
