// src/pages/ManagerDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SideMenu from './sideMenu';
import SummaryCards from './summaryCards';
import StaffShifts from './staffShifts';
import AllocateShift from './allocateShift';
import LeaveRequests from './leaveRequests';
import AllStaffInfo from './allStaffInfo';
import ManagerDetails from './managerDetails';
import Spinner from '../../../components/spinner';
import './managerdash.css';

const ManagerDashboard = () => {
  const [user, setUser] = useState(() => JSON.parse(sessionStorage.getItem("user")) || {});
  const [shifts, setShifts] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [staffDatas, setStaffDatas] = useState([]);
  const [staffDetails, setStaffDetails] = useState([]);
  const [newShift, setNewShift] = useState({
    staffName: '',
    date: '',
    start: '',
    end: '',
  });
  const [activeSection, setActiveSection] = useState('staffShifts');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(true);
  const navigate = useNavigate();

  
  const apiUrl = process.env.REACT_APP_API_URL || "https://companyrotasoftware-3f6dcaa37799.herokuapp.com";

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
      
        console.log(process.env.REACT_APP_API_URL);
        const staffResponse = await axios.get(`${apiUrl}/staff`);
        setStaffDatas(staffResponse.data);

        const shiftResponse = await axios.get(`${apiUrl}/shifts`);
        setShifts(shiftResponse.data);

        const leaveResponse = await axios.get(`${apiUrl}/leave`);
        setLeaveRequests(leaveResponse.data);

        const staffDetailsResponse = await axios.get(`${apiUrl}/staff/timesheet`);
        setStaffDetails(staffDetailsResponse.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [apiUrl]);

  
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

  const totalRemainingLeave = React.useMemo(() => 
    staffDatas.reduce((acc, staff) => acc + (staff.totalLeave - staff.usedLeave || 0), 0),
    [staffDatas]
  );
  

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${apiUrl}/auth/logout`, {}, { withCredentials: true });
      if (response.status === 200) {
        navigate('/');
      } else {
        alert('Logout failed. Please try again.');
      }
    } catch (err) {
      alert('Logout failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddShift = async () => {
    if (newShift.staffName && newShift.date && newShift.start && newShift.end) {
      try {
        setIsLoading(true);
        const formattedShift = {
          staffname: newShift.staffName,
          shiftDate: newShift.date,
          shiftStart: formatTime(newShift.start), 
          shiftEnd: formatTime(newShift.end)   
        };
        const response = await axios.post(`${apiUrl}/shifts/addShift`, formattedShift);
        if (response.status === 201) {
          setShifts([...shifts, { id: response.data.shiftId, ...formattedShift }]);
          setNewShift({ staffName: "", date: "", start: "", end: "" });
        }
      } catch (error) {
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
        const response = await axios.delete(`${apiUrl}/shifts/delete/${id}`);
        
      
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
        
          const response = await axios.put(`${apiUrl}/leave/approve/${request.id}`);
  
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
       
          alert("An error occurred while trying to approve the leave.");
      }
  };
  
  
  
    const handleDeclineLeave = async (id) => {
     
      const request = leaveRequests.find((req) => req.id === id);
      if (!request) {
     
          return;
      }
     
      try {
          
          const response = await axios.put(`${apiUrl}/leave/decline/${request.id}`);
  
       
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
  
          alert("An error occurred while trying to decline the leave.");
      }
  };
  
  
  const handleDeleteLeave = async (id) => {
    try {
        const response = await axios.delete(`${apiUrl}/leave/delete/${id}`);
        
  
        if (response.status === 200) {
     
            setLeaveRequests(prevRequests => prevRequests.filter(req => req.id !== id));
        } else {
            alert("Failed to delete leave request.");
        }
    } catch (error) {
   
        alert("Failed to delete leave request.");
    }
  }
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

  if (isLoading || submitting) {
    return <Spinner />;
  }

  return (
    <main className="manager-dashboard-wrapper">
      <div className="manager-dashboard-container">
        <SideMenu setActiveSection={setActiveSection} handleLogout={handleLogout} />
        <div className="grid-2">
          <h1>Manager Dashboard</h1>
          <SummaryCards
            staffCount={staffDatas.length}
            shiftCount={shifts.length}
            totalRemainingLeave={totalRemainingLeave}
          />
          {activeSection === 'staffShifts' && <StaffShifts shifts={shifts} handleDeleteShift={handleDeleteShift} />}
          {activeSection === 'allocateShift' && <AllocateShift newShift={newShift} setNewShift={setNewShift} handleAddShift={handleAddShift} staffDatas={staffDatas} />}
          {activeSection === 'leaveRequests' && <LeaveRequests leaveRequests={leaveRequests} handleApproveLeave={handleApproveLeave} 
          handleDeclineLeave={handleDeclineLeave} handleDeleteLeave={handleDeleteLeave}/>}
          {activeSection === 'allStaffInfo' && <AllStaffInfo staffDetails={staffDetails} handleDeleteShift={handleDeleteShift} />}
          {activeSection === 'managerDetails' && <ManagerDetails user={user} />}
        </div>
      </div>
    </main>
  );
};

export default ManagerDashboard;
