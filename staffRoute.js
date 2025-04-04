
const express = require('express');
const router = express.Router();
const pool = require('./db'); 


  
  router.get('/:id/next-shift', async (req, res) => {
    const userId = req.params.id;
  
    try {
      const result = await pool.query(
        `
        SELECT s.id, s.date, s.start_time AS shiftStart, s.end_time AS shiftEnd, st.name AS staffName , mr.position AS position
        FROM shifts s
        JOIN staff st ON s.staff_id = st.id
    LEFT JOIN staffrole mr ON s.staff_id = mr.staff_id
        WHERE s.staff_id = $1 AND (s.date > CURRENT_DATE OR (s.date = CURRENT_DATE AND s.start_time > CURRENT_TIME))
        ORDER BY s.date, s.start_time
        LIMIT 1;
        `,
        [userId]
      );
  
      if (result.rows.length === 0) {
      
        return res.json({ message: 'No upcoming shifts found.' });
      }
  
    
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching next shift:', error.message);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  

router.get('/', async (req, res) => {


    try {
      const staff = await pool.query('SELECT * FROM staff');
      res.json(staff.rows);
    } catch (error) {
     
      res.status(500).json({ message: 'Internal server error' });
    }
  
  });
  
  router.get('/timesheet', async (req, res) => {
    try {
      const query = `
        SELECT 
          shifts.staff_id, 
          staff.name AS staffname, 
          staff.email AS staffemail,
          mr.position AS position,
          COALESCE(approved_leave.days_requested, 0) AS usedleave,
          COALESCE(approved_leave.totalleave, 0) AS totalleave,
          COUNT(*) AS total_shifts,
          SUM(
            CASE
              WHEN end_time < start_time THEN
                EXTRACT(EPOCH FROM (end_time + INTERVAL '1 day' - start_time)) / 3600 -- Handle overnight shifts
              ELSE
                EXTRACT(EPOCH FROM (end_time - start_time)) / 3600 -- Regular shifts
            END
          ) AS total_hours
        FROM 
          shifts
        JOIN 
          staff ON shifts.staff_id = staff.id
        LEFT JOIN (
          SELECT 
            staff_id, 
            SUM(days_requested) AS days_requested, 
            SUM(totalleave) AS totalleave
          FROM 
            leave
          WHERE 
            status = 'approved' -- Only include approved leaves
          GROUP BY 
            staff_id
        ) AS approved_leave ON shifts.staff_id = approved_leave.staff_id
        LEFT JOIN 
          staffrole mr ON staff.id = mr.staff_id
        GROUP BY 
          shifts.staff_id, staff.name, staff.email, mr.position, approved_leave.days_requested, approved_leave.totalleave;
      `;
  
      const timesheet = await pool.query(query);
  
    
      const formattedTimesheet = timesheet.rows.map(row => ({
        ...row,
        total_hours: parseFloat(row.total_hours).toFixed(2) 
      }));
  
    
  
      res.status(200).json(formattedTimesheet);
    } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });
  router.get('/all', async (req, res) => {
    try {
      const query = `
        SELECT 
          mr.pay AS pay, 
          mr.position AS position, 
          m.role AS role, 
          m.name AS name, 
          m.email AS email, 
          m.address AS address
        FROM staff m 
        JOIN staffrole mr ON m.id = mr.staff_id
      `;
      
      const result = await pool.query(query);
      
    
      if (result.rows.length === 0) {
        return res.json({ message: 'No staff found' });
      }
  
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching staff:', error.message); 
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });
  


  module.exports = router;
  