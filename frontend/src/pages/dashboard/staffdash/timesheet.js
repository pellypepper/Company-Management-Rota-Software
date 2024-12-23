import React from "react";
import "./timesheet.css";
import { useOutletContext } from 'react-router-dom';

const Timesheet = () => {
 
  const { shifts } = useOutletContext(); 
  const hourlyRate = 15;


  const getHours = (start, end) => {
    const [startHour, startMinute] = start.split(":").map(Number);
    const [endHour, endMinute] = end.split(":").map(Number);

    const startTime = startHour + startMinute / 60;
    const endTime = endHour + endMinute / 60;
     
    if (endTime < startTime) {
      return startTime - endTime;
    } else{
      return endTime - startTime;
    }
   
  };

  // Calculate total hours worked
  const totalHours = shifts.reduce(
    (sum, shift) => sum + getHours(shift.shiftstart, shift.shiftend),
    0
  );

  // Calculate total pay
  const totalPay = totalHours * hourlyRate;

  return (
    <div className="timesheet-container">
      <h1>Staff Timesheet</h1>
      <div className="staff-timesheet">
        <p>Hourly Rate: ${hourlyRate.toFixed(2)}</p>
        <table className="timesheet-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Hours Worked</th>
            </tr>
          </thead>
          <tbody>
            {shifts.map((shift, shiftIndex) => (
              <tr key={shiftIndex}>
                <td>{shift.date}</td>
                <td>{shift.shiftstart}</td>
                <td>{shift.shiftend}</td>
                <td>{getHours(shift.shiftstart, shift.shiftend).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="summary">
          <p>
            Total Hours Worked: <strong>{totalHours.toFixed(2)}</strong>
          </p>
          <p>
            Total Pay: <strong>${totalPay.toFixed(2)}</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Timesheet;
