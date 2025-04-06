// src/components/SummaryCards.js
import React from 'react';

const SummaryCards = ({ staffCount, shiftCount, totalRemainingLeave }) => (
  <div className="summary-cards">
    <div className="summary-card">
      <h2>{staffCount}</h2>
      <p>Total Staff</p>
    </div>
    <div className="summary-card">
      <h2>{shiftCount}</h2>
      <p>Total Shifts</p>
    </div>
    <div className="summary-card">
      <h2>{totalRemainingLeave}</h2>
      <p>Total Remaining Leave</p>
    </div>
  </div>
);

export default SummaryCards;
