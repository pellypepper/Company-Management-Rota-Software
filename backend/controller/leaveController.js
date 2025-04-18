
const pool = require('../db');

// get all leave requests
const getleave = async (req, res) => {
    try {
      
      const allleave = await pool.query(`
            SELECT 
                leave.id, 
                staff.name AS staffname, 
                leave.totalLeave, 
                leave.leavestart, 
                leave.leaveend, 
                leave.days_requested, 
                leave.status 
            FROM 
                leave 
            JOIN 
                staff ON leave.staff_id = staff.id
        `);
  
 
      res.json(allleave.rows);
    } catch (error) {
  
      res.status(500).json({ message: 'Internal server error' });
    }
  }


  // request leave
  const requestleave = async (req, res) => {
    const { leavestart, leaveend, days_req } = req.body;
    const staff_id = req.params.id;
    const status = 'pending';
  
    try {

      if (!leavestart || !leaveend || !days_req) {
        return res.status(400).json({ message: 'All fields are required: leavestart, leaveend, days_req.' });
      }
  

      const totalLeaveResult = await pool.query('SELECT totalleave FROM leave WHERE staff_id = $1', [staff_id]);
  
     
      if (totalLeaveResult.rows.length === 0) {
         const totalleave = 40;
        const newLeave = await pool.query(
          'INSERT INTO leave (staff_id, totalleave, leavestart, leaveend, days_requested, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
          [staff_id, totalleave, leavestart, leaveend, days_req, status]
        );
  
        return res.status(201).json(newLeave.rows[0]); 
      } else {
        const totalLeave = totalLeaveResult.rows[0].totalleave; 
  
        const remainingLeave = totalLeave - days_req; 
  
        
        if (remainingLeave >= 0) {
        
          const newLeave = await pool.query(
            'INSERT INTO leave (staff_id, leavestart, leaveend, days_requested, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [staff_id, leavestart, leaveend, days_req, status]
          );
  
          // Update total leave after inserting the new leave request
          await pool.query(
            'UPDATE leave SET totalleave = $1 WHERE staff_id = $2',
            [remainingLeave, staff_id]
          );
  
          // Fetch the updated leave record to confirm totalleave
          const updatedLeaveResult = await pool.query('SELECT * FROM leave WHERE staff_id = $1 ORDER BY id DESC LIMIT 1', [staff_id]);
        
  
          return res.status(201).json(updatedLeaveResult.rows[0]); 
        } else {
         
          return res.status(400).json({ message: 'Insufficient leave days' });
        }
      }
    } catch (error) {
  
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // get staff leave
  const staffLeave = async (req, res) => {
    const staffId = req.params.id;
  
  
    try {

      const staffLeave = await pool.query('SELECT * FROM leave WHERE staff_id = $1', [staffId]);
  
    
      res.json(staffLeave.rows);
    } catch (error) {
  
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // approve leave
  const approveLeave = async (req, res) => {
    const leaveId = req.params.id;
    
  
    try {

    
      const result = await pool.query('UPDATE leave SET status = $1 WHERE id = $2 RETURNING *',
        ["approved", leaveId]);
  
      
  
 
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Leave request not found' });
      }
  
      const remainingLeave = result.rows[0].totalleave - result.rows[0].days_requested;
  
      const updateLeave = await pool.query('UPDATE leave SET totalleave = $1 WHERE id = $2 RETURNING *',
        [remainingLeave, leaveId]);
  
      res.json(updateLeave.rows[0]);
    } catch (error) {
     
      res.status(500).json({ message: 'Internal server error' });
    }
  }


  // decline leave
  const declineleave = async (req, res) => {
    const leaveId = req.params.id;
   
    try {

      const result = await pool.query('UPDATE leave SET status = $1 WHERE id = $2 RETURNING *',
        ["declined", leaveId]);
  
   
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Leave request not found' });
      }
  
    
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error declining leave:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

// delete leave
  const deleteLeave = async (req, res) => {
    const leaveId = req.params.id;
   
    try {
    
      const result = await pool.query('DELETE FROM leave WHERE id = $1 RETURNING *', [leaveId]);
         if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Leave request not found' });
      }
  
       res.json(result.rows[0]);
    } catch (error) {
      console.error('Error deleting leave:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

module.exports = {
    getleave,
    requestleave,
    staffLeave,
    approveLeave,
    declineleave,
    deleteLeave
  };