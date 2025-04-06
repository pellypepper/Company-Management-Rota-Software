// src/components/LeaveRequests.js
import React from 'react';

const LeaveRequests = ({ leaveRequests, handleApproveLeave, handleDeclineLeave, handleDeleteLeave }) => (
  <div className="leave-requests">
    <h2>Leave Requests</h2>
    {leaveRequests.length > 0 ? (
      <table>
        <thead>
          <tr>
            <th>Staff Name</th>
            <th>Leave Start</th>
            <th>Leave End</th>
            <th>Days Requested</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaveRequests.map((request) => (
            <tr key={request.id}>
              <td>{request.staffname}</td>
              <td>{new Date(request.leavestart).toLocaleDateString()}</td>
              <td>{new Date(request.leaveend).toLocaleDateString()}</td>
              <td>{request.days_requested}</td>
              <td>{request.status}</td>
              <td className="leave-btn">
                <button className="approve" onClick={() => handleApproveLeave(request.id)}>Approve</button>
                <button className="decline" onClick={() => handleDeclineLeave(request.id)}>Decline</button>
                <button onClick={() => handleDeleteLeave(request.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p>No leave requests.</p>
    )}
  </div>
);

export default LeaveRequests;
