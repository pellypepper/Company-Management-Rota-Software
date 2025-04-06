import React, { useState, useEffect } from "react";
import "./rota.css";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Rota = () => {
  const [currentDate, setCurrentDate] = useState("2024-12-18");
  const [staffData, setStaffData] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:10000";

  const fetchStaffData = async (date) => {
    try {
      const response = await fetch(`${apiUrl}/shifts/date/${date}`);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setStaffData(data);
    } catch (error) {
      console.error("Error fetching staff data:", error);
    }
  };

  useEffect(() => {
    fetchStaffData(currentDate);
  }, [currentDate]);

  const handleNextDay = () => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);
    setCurrentDate(nextDate.toISOString().split("T")[0]);
  };

  const handlePreviousDay = () => {
    const prevDate = new Date(currentDate);
    prevDate.setDate(prevDate.getDate() - 1);
    setCurrentDate(prevDate.toISOString().split("T")[0]);
  };

  return (
    <div className="staff-shift-container">
      <div className="shift-navigation">
        <button onClick={handlePreviousDay} aria-label="Previous Day" className="arrow-button">
          <FaChevronLeft />
        </button>
        <h1 className="current-date">{currentDate}</h1>
        <button onClick={handleNextDay} aria-label="Next Day" className="arrow-button">
          <FaChevronRight />
        </button>
      </div>
      <div className="shift-list">
        {staffData.length > 0 ? (
          staffData.map((staff, index) => (
            <div key={staff.id} className="staff-shift-item">
              <p className="staff-name">{staff.staffname}  </p>
              <p className="staff-name">{staff.position}  </p>
              <span className="working-time">Working Time: {staff.shiftstart} - {staff.shiftend}</span>
            </div>
          ))
        ) : (
          <p className="no-shifts">No staff scheduled for this day.</p>
        )}
      </div>
    </div>
  );
};

export default Rota;
