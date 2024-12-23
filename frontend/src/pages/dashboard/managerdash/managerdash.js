import React, { useState, useEffect } from "react";
import "./managerdash.css";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Spinner from "../../../components/spinner";







const ManagerDashboard = () => {
  const [user, setUser] = useState(() => JSON.parse(sessionStorage.getItem("user")) || {});
  const [shifts, setShifts] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [staffDatas, setStaffDatas] = useState([]); 
  
  const [newShift, setNewShift] = useState({
    staffName: "",
    date: "",
    start: "",
    end: "",
  });
  const [staffDetails, setStaffDetails] = useState([]);

  
  
  const [activeSection, setActiveSection] = useState("staffShifts"); 

const [error, setError] = useState(null);
const [isLoading, setIsLoading] = useState(false);
const [submitting, setSubmitting] = useState(true);
const navigate = useNavigate();


useEffect(() => {
    const fetchStaffData = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/staff`);
            setStaffDatas(response.data);
    
        } catch (error) {
            setError(error.message);
            console.error("Failed to fetch staff data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    fetchStaffData();
}, []);

const fetchShifts = async () => {
  setIsLoading(true);
  try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/shifts`);
      setShifts(response.data);
  
  } catch (error) {
      setError(error.message);
      console.error("Failed to fetch shift data:", error);
  } finally {
      setIsLoading(false);
  }
};


const fetchLeave = async () => {
  setIsLoading(true);
  try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/leave`);
      setLeaveRequests(response.data);
     
  } catch (error) {
      setError(error.message);
  
  } finally {
      setIsLoading(false);
  }
};
const fetchStaffDetails = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/staff/timesheet`);
    const staffDetails = response.data;
    setStaffDetails(staffDetails);


  } catch (error) {
    console.error("Error fetching staff details:", error);
  }
};
useEffect(() => {
  fetchShifts(); 
  fetchLeave();
  fetchStaffDetails();

}, []);


useEffect(() => {
  const loadedUser = JSON.parse(sessionStorage.getItem("user")) || {};
  setUser(loadedUser);
}, []);

useEffect(() => {
      
        
  const timer = setTimeout(() => {
   
      setSubmitting(false);
  }, 1000); 

  
  return () => {
     
      clearTimeout(timer);
  };
}, []); 


const formatTime = (time) => {
  if (!time) return '';
  try {
      return new Date(`2000-01-01T${time}`).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
      });
  } catch (error) {
      return time;
  }
};


const handleLogout = async () => {
  try {
    setIsLoading(true);
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/logout`, {}, { withCredentials: true });

    if (response.status === 200) {
      navigate("/"); 
    } else {
      alert("Logout failed. Please try again.");
    }
  } catch (err) {
    alert("Logout failed. Please try again.");
   
  } finally {
      setIsLoading(false);
  }
};



const handleAddShift = async () => {
  let formattedShift = {};

  if (newShift.staffName && newShift.date && newShift.start && newShift.end) {
    formattedShift = {
      staffname: newShift.staffName, 
      shiftDate: newShift.date,      
      shiftStart: formatTime(newShift.start), 
      shiftEnd: formatTime(newShift.end)     
    };

    try {
      setIsLoading(true);

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/shifts/addShift`, formattedShift);
     
      if (response.status === 201) {
       
        setShifts([...shifts, { id: response.data.shiftId, ...formattedShift }]);
    
        fetchShifts();

        setNewShift({ staffName: "", date: "", start: "", end: "" });
      
      }
    } catch (error) {
      console.error("Error adding shift:", error);
      alert("Failed to add shift.");
    } finally {
      setIsLoading(false);
    }

  } else {
    alert("Please fill all shift fields!");
  }
};



const handleDeleteShift = async (id) => {
  try {
      const response = await axios.delete(`${process.env.REACT_APP_API_URL}/shifts/delete/${id}`);
      
    
      if (response.status === 200) {
          console.log("Shift deleted:", response.data);
        
          setShifts(prevShifts => prevShifts.filter(shift => shift.id !== id));
      } else {
          alert("Failed to delete shift.");
      }
  } catch (error) {
      console.error("Error deleting shift:", error);
      alert("Failed to delete shift.");
  }
};



  const handleApproveLeave = async (id) => {
    const request = leaveRequests.find((req) => req.id === id);
    if (!request) {
        console.error("Leave request not found.");
        return;
    }

    try {
      
        const response = await axios.put(`${process.env.REACT_APP_API_URL}/leave/approve/${request.id}`);

        if (response.status === 200) {


           
            setLeaveRequests((prevRequests) =>
                prevRequests.map((req) =>
                    req.id === id ? { ...req, status: "Approved" } : req
                )
            );

        } else {
            alert("Failed to approve leave.");
        }
    } catch (error) {
        console.error("Error approving leave:", error);
        alert("An error occurred while trying to approve the leave.");
    }
};



  const handleDeclineLeave = async (id) => {
   
    const request = leaveRequests.find((req) => req.id === id);
    if (!request) {
        console.error("Leave request not found.");
        return;
    }
   
    try {
        
        const response = await axios.put(`${process.env.REACT_APP_API_URL}/leave/decline/${request.id}`);

     
        if (response.status === 200) {
           

         
            setLeaveRequests((prevRequests) =>
                prevRequests.map((req) =>
                    req.id === id ? { ...req, status: "Declined" } : req
                )
            );


        } else {
            alert("Failed to decline leave.");
        }
    } catch (error) {
        console.error("Error declining leave:", error);
        alert("An error occurred while trying to decline the leave.");
    }
};


const handleDeleteLeave = async (id) => {
  try {
      const response = await axios.delete(`${process.env.REACT_APP_API_URL}/leave/delete/${id}`);
      

      if (response.status === 200) {
   
          setLeaveRequests(prevRequests => prevRequests.filter(req => req.id !== id));
      } else {
          alert("Failed to delete leave request.");
      }
  } catch (error) {
      console.error("Error deleting leave request:", error);
      alert("Failed to delete leave request.");
  }
}



  const totalRemainingLeave = React.useMemo(() => 
    staffDatas.reduce((acc, staff) => acc + (staff.totalLeave - staff.usedLeave || 0), 0),
    [staffDatas]
  );

  const renderActiveSection = () => {
    if (isLoading) {
      return <div className="loading">Loading...</div>;
    }
  
    if (error) {
      return <div className="error">Error: {error}</div>;
    }
  
    switch (activeSection) {
      case "staffShifts":
        return (
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
  
      case "allocateShift":
        return (
          <div className="shift-allocation">
            <h2>Allocate Shifts</h2>
            <div className="shift-form">
              <label>
                Staff:
                <select
                  value={newShift.staffName}
                  onChange={(e) => setNewShift({ ...newShift, staffName: e.target.value })}
                >
                  <option value="">Select Staff</option>
                  {staffDatas.map((staff) => (
                    <option key={staff.id} value={staff.name}>
                      {staff.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Date:
                <input
                  type="date"
                  value={newShift.date}
                  onChange={(e) => setNewShift({ ...newShift, date: e.target.value })}
                />
              </label>
              <label>
                Start Time:
                <input
                  type="time"
                  value={newShift.start}
                  onChange={(e) => setNewShift({ ...newShift, start: e.target.value })}
                />
              </label>
              <label>
                End Time:
                <input
                  type="time"
                  value={newShift.end}
                  onChange={(e) => setNewShift({ ...newShift, end: e.target.value })}
                />
              </label>
              <button onClick={handleAddShift}>Add Shift</button>
            </div>
          </div>
        );
  
      case "leaveRequests":
        return (
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
  
      case "allStaffInfo":
        return (
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

      
      case "managerDetails":
          return (
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
  
      default:
        return null;
    }
  };
  if(isLoading || submitting ) {
    return <Spinner />;
}

  

  return (
       <main className="manager-dashboard-wrapper">
          
         <div className="manager-dashboard-container">
 

      {/* Side Menu */}
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

      <div className="grid-2"> 
      <h1>Manager Dashboard</h1>
              {/* Summary Section */}
      <div className="summary-cards">
        <div className="summary-card">
          <h2>{staffDatas.length}</h2>
          <p>Total Staff</p>
        </div>
        <div className="summary-card">
          <h2>{shifts.length}</h2>
          <p>Total Shifts</p>
        </div>
        <div className="summary-card">
          <h2>{totalRemainingLeave}</h2>
          <p>Total Remaining Leave</p>
        </div>
      </div>

      {/* Active Section Rendering */}
      {renderActiveSection()}
      </div>

      
    </div>
       </main>
  );
};

export default ManagerDashboard;
