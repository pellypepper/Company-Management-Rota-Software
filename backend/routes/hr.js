

const express = require('express');
const router = express.Router();
const pool = require('../db'); 

app.post('/addrole', async (req, res) => {
    const { position, role, pay, name } = req.body;
  
     
    try {
      const roleCheck = await pool.query(
        `SELECT CAST(id AS VARCHAR) AS identifier FROM managerrole WHERE name = $1
        UNION
        SELECT name FROM staffrole WHERE name = $1;
        `,
        [name]
    );
  
    if (roleCheck.rows.length > 0) {
        return res.status(400).json({ message: 'Role already exists' });
    }
        let result = await pool.query('SELECT * FROM staff WHERE name = $1', [name]);
        let tableName;
        let id;
  
        if (result.rows.length > 0) {
          
            id = result.rows[0].id; 
            tableName = 'staffrole';
        } else {
      
            result = await pool.query('SELECT * FROM manager WHERE name = $1', [name]);
            if (result.rows.length > 0) {
        
                id = result.rows[0].id; 
                tableName = 'managerrole'; 
            } else {
            
                return res.status(404).json({ message: 'User not found' });
            }
        }
  
        
        const insert = await pool.query(`INSERT INTO ${tableName} (staff_id,name, pay, role, position) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [id,name, pay, role, position]);
        
        if (insert.rows.length > 0) {
          
            return res.json(insert.rows[0]);
        } else {
  
            return res.status(500).json({ message: 'Internal server error' });
        }
    } catch (error) {
        console.error('Error adding role:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
  });


  module.exports = router;