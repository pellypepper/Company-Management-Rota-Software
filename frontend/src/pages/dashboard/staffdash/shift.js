import React, { useState } from "react";
import "./shift.css";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useOutletContext } from 'react-router-dom';

const Shift = () => {
  const { shifts } = useOutletContext(); 
  const [currentMonth, setCurrentMonth] = useState(new Date());

  

  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };

  const handlePreviousMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
  };

  const renderDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];


    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty" />);
    }


    for (let day = 1; day <= lastDay.getDate(); day++) {
      const staffShifts = shifts.filter(shift => {
        const shiftDate = new Date(shift.date);
        return shiftDate.getDate() === day &&
               shiftDate.getMonth() === month &&
               shiftDate.getFullYear() === year;
      });

      days.push(
        <div key={day} className="calendar-day">
          <div className="day-number">{day}</div>
          <div className="staff-schedule">
            {staffShifts.length > 0 ? (
              <ul>
                {staffShifts.map((staff, index) => (
                  <li key={index}>
                   <p> {staff.staffname}</p>
                   <p> {staff.position}</p>
                    <p>{formatTime(staff.shiftstart)} - {formatTime(staff.shiftend)} </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No shifts</p>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button className="nav-button" onClick={handlePreviousMonth}>
          <FaChevronLeft />
        </button>
        <h2>
          {currentMonth.toLocaleString("default", { month: "long" })} {currentMonth.getFullYear()}
        </h2>
        <button className="nav-button" onClick={handleNextMonth}>
          <FaChevronRight />
        </button>
      </div>
      <div className="calendar-body">
        <div className="calendar-weekdays">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="calendar-weekday">{day}</div>
          ))}
        </div>
        <div className="calendar-days">
          {renderDaysInMonth()}
        </div>
      </div>
    </div>
  );
};

export default Shift;
