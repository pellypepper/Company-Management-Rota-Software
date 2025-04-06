// src/components/SideMenu.js
import React from 'react';

const SideMenu = ({ setActiveSection, handleLogout }) => (
  <div className="side-wrapper">
    <div className="side-menu">
      <button onClick={() => setActiveSection("staffShifts")}>Staff Shifts</button>
      <button onClick={() => setActiveSection("allocateShift")}>Allocate Shift</button>
      <button onClick={() => setActiveSection("leaveRequests")}>Leave Requests</button>
      <button onClick={() => setActiveSection("allStaffInfo")}>View All Staff Info</button>
      <button onClick={() => setActiveSection("managerDetails")}>My Details</button>
      <button onClick={handleLogout}>Signout</button>
    </div>
  </div>
);

export default SideMenu;
