import React, { useState, useEffect, useCallback } from "react";
import NavBar from './staffnav';
import "./staffdash.css";
import { Outlet } from "react-router-dom";
import Spinner from "../../../components/spinner";

export default function StaffDashboard() {
    const [user, setUser] = useState(() => JSON.parse(sessionStorage.getItem("user")) || {});
    const [shifts, setShifts] = useState([]);
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(null); 
    useEffect(() => {
        const loadedUser = JSON.parse(sessionStorage.getItem("user")) || {};
        setUser(loadedUser);
    }, []);

    
    const fetchStaffShifts = useCallback(async () => {
        if (!user.id) return;

        setLoading(true); 
        setError(null);
        setShifts([]);

        try {
            
            const response = await fetch(`http://localhost:3000/shifts/staff/${user.id}`, {
                method: 'GET',
                credentials: 'include',
            });

        
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
        
            const data = await response.json();

          
            if (data && Array.isArray(data)) {
                setShifts(data); 
        
            } else {
                setError("Shifts data is not available.");
            }
        } catch (err) {
            setError(`Failed to load shifts data: ${err.message}`);
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    }, [user.id]); 



    useEffect(() => {
        fetchStaffShifts();
    }, [fetchStaffShifts, user]); 
    if(loading) {
        return <Spinner />;
    }


    return (
        <div className="staff-dash-container">
            {loading && <p>Loading shifts...</p>} 
            {error && <p>{error}</p>} 
            
            <section>
                <NavBar />
            </section>

            <Outlet context={{ user, shifts }} />
        </div>
    );
}
