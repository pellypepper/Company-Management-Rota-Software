import React, {useState, useEffect} from "react";
import { FaTachometerAlt, FaCalendarAlt, FaClock, FaFileAlt, FaPlane } from "react-icons/fa";
import "./staffdash.css";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "../../../components/spinner";

export default function StaffDashboard() {
    const mainContainer = {
        position: "fixed",
        bottom: "0",
        marginBottom: "20px",
        width: "100%",
        zIndex: "100",
    };
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    const [submitting, setSubmitting] = useState(true)


    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:10000";
 
    useEffect(() => {
      
        
        const timer = setTimeout(() => {
         
            setSubmitting(false);
        }, 1000); 

        
        return () => {
           
            clearTimeout(timer);
        };
    }, []); 

    const handleLogout = async () => {
        try {
            setLoading(true);
          const response = await axios.post(`${apiUrl}/auth/logout`, {}, { withCredentials: true });
      
          if (response.status === 200) {
            navigate("/"); 
          } else {
            alert("Logout failed. Please try again.");
          }
        } catch (err) {
          alert("Logout failed. Please try again.");
          console.error("Logout error:", err);
        } finally{
            setLoading(false);
        }
      };
      if (submitting || loading) {
        return (
            <div className="spinner-wrapper">
                <Spinner />
            </div>
        );
    }

    return (
        <main >
            <section style={mainContainer} className="dash-nav-wrapper">
                <nav className="d-flex">
                    <NavLink to="/staffdash" className="nav-link">
                        <div>
                            <FaTachometerAlt className="nav-icon" />
                            <p>Dashboard</p>
                        </div>
                    </NavLink>

                    <NavLink to="/staffdash/rota" className="nav-link">
                        <div>
                            <FaCalendarAlt className="nav-icon" />
                            <p>Rotas</p>
                        </div>
                    </NavLink>

                    <NavLink to="/staffdash/shift" className="nav-link">
                        <div>
                            <FaClock className="nav-icon" />
                            <p>Shift</p>
                        </div>
                    </NavLink>

                    <NavLink to="/staffdash/timesheet" className="nav-link">
                        <div>
                            <FaFileAlt className="nav-icon" />
                            <p>Timesheet</p>
                        </div>
                    </NavLink>

                    <NavLink to="/staffdash/leave" className="nav-link">
                        <div>
                            <FaPlane className="nav-icon" />
                            <p>Leave</p>
                        </div>
                    </NavLink>
                    <NavLink onClick={handleLogout} className="nav-link">
                        <div>
                            <FaPlane className="nav-icon" />
                            <p>Signout</p>
                        </div>
                    </NavLink>
                </nav>
            </section>
        </main>
    );
}
