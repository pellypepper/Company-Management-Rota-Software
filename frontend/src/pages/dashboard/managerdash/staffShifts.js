// src/components/StaffShifts.js
import React from 'react';

const StaffShifts = ({ shifts, handleDeleteShift }) => (
  <div className="allocated-shifts">
    <h2>Allocated Shifts</h2>
    {shifts.length > 0 ? (
      <table>
        <thead>
          <tr>
            <th>Staff Name</th>
            <th>Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {shifts.map((shift) => (
            <tr key={shift.id}>
              <td>{shift.staffname}</td>
              <td>{new Date(shift.date).toLocaleDateString()}</td>
              <td>{shift.shiftstart}</td>
              <td>{shift.shiftend}</td>
              <td>
                <button onClick={() => handleDeleteShift(shift.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p>No shifts allocated yet.</p>
    )}
  </div>
);

export default StaffShifts;
