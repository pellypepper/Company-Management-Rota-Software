
import React from 'react';

const AllStaffInfo = ({ staffDetails }) => (
  <div className="all-staff-info">
    <h2>All Staff Information</h2>
    {staffDetails.length > 0 ? (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Position</th>
            <th>Total Leave</th>
            <th>Used leave</th>
            <th>Total Shifts</th>
            <th>Total Hours Worked</th>
          </tr>
        </thead>
        <tbody>
          {staffDetails.map((staff, index) => (
            <tr key={staff.staffemail || index}>
              <td>{staff.staffname}</td>
              <td className="td-email">{staff.staffemail}</td>
              <td>{staff.position}</td>
              <td>{staff.totalleave}</td>
              <td>{staff.usedleave}</td>
              <td>{staff.total_shifts}</td>
              <td>{staff.total_hours}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p>No staff data available.</p>
    )}
  </div>
);

export default AllStaffInfo;
