import React, { useEffect, useState } from "react";
import "./leave.css";
import { useOutletContext } from 'react-router-dom';

const Leave = () => {
  const { user } = useOutletContext();

  const [usedLeave, setUsedLeave] = useState(0);
  const [requestedDays, setRequestedDays] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [totalLeave , setTotalLeave] = useState(0);


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/leave/staff/${user.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
   
  

        if (data && data.length > 0) {
          setLeaveRequests(data);
          const totalDaysRequested = data.map((request) => request.days_requested).reduce((acc, curr) => acc + curr, 0);
          setUsedLeave(totalDaysRequested);
          setTotalLeave(data[0].totalleave || 40); 
        } else {
      
          setLeaveRequests([]);
          setUsedLeave(0);
          setTotalLeave(40); 
        }
      } catch (error) {
    
        setLeaveRequests([]); 
        setUsedLeave(0);
        setTotalLeave(40); 
      }
    };
  
    fetchLeaveData();
  }, [user.id]);
  
  
  
  // Function to handle leave requests
  const handleRequestLeave = async (e) => {
    e.preventDefault(); 


    if (!requestedDays || !startDate || !endDate) {
      alert("Invalid leave request. Fill all fields");
      return;
    }


    const newLeave = {
      leavestart: startDate,
      leaveend: endDate,
      days_req: requestedDays,

    };


    
    try {
      const response = await fetch(`http://localhost:3000/leave/request/${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLeave),
      });

      if (response.ok) {
        const data = await response.json();
       
        setLeaveRequests([...leaveRequests, data]);

        alert("Leave request submitted successfully!");


   
        setRequestedDays(0);
        setStartDate('');
        setEndDate('');
     
      } else {
        alert("Failed to submit leave request. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while submitting your leave request.");
    }
  };

  return (
    <div className="leave-request-container">
      <h1>Annual Leave Request</h1>
      <div className="leave-summary">
        <p>
          <strong>Total Annual Leave:</strong> {totalLeave} days
        </p>
        <p>
          <strong>Used Leave:</strong> {usedLeave} days
        </p>
        <p>
          <strong>Remaining Leave:</strong> {totalLeave - usedLeave} days
        </p>
      </div>
      <div className="leave-request-form">
        <form onSubmit={handleRequestLeave}>
          <label>
            Request Leave Days:
            <input
              type="number"
              value={requestedDays}
              onChange={(e) => setRequestedDays(Number(e.target.value))}
              min="1"
            />
          </label>
          <label>
            Leave Start date:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(formatDate(e.target.value))}
              required
            />
          </label>
          <label>
            Leave End date:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(formatDate(e.target.value))}
              required
            />
          </label>
          <button type="submit">Request Leave</button>
        </form>
      </div>
      <div className="leave-history">
        <h2>Leave History</h2>
        {leaveRequests.length > 0 ? (
  <ul>
    {leaveRequests.map((request, index) => (
      <li className="d-flex leave-history-box" key={index}>
        <p>Days Requested: <span>{request.days_requested}</span></p>
        <p>Start Date: {request.leavestart}  </p>
        <p> End Date: {request.leaveend}</p>
        <button>{request.status}</button>
      </li>
    ))}
  </ul>
) : (
  <p>No leave requests yet.</p>
)}

      </div>
    </div>
  );
};

export default Leave;
