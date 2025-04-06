// src/components/ManagerDetails.js
import React from 'react';

const ManagerDetails = ({ user }) => (
  <div className="manager-details">
    <h2>My Details</h2>
    <table className="details-table">
      <tbody>
        <tr>
          <th>First Name:</th>
          <td>{user.name || "N/A"}</td>
        </tr>
        <tr>
          <th>Email:</th>
          <td>{user.email || "N/A"}</td>
        </tr>
        <tr>
          <th>City:</th>
          <td>{user.city || "N/A"}</td>
        </tr>
        <tr>
          <th>Role:</th>
          <td>{user.role || "Manager"}</td>
        </tr>
        <tr>
          <th>Position:</th>
          <td>{user.position || "Manager"}</td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default ManagerDetails;
