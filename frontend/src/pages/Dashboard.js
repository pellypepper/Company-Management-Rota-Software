import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(location.state?.user || null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            if (!user) {
                try {
                    const response = await fetch('/dashboard', {
                        method: 'GET',
                        credentials: 'include',
                    });
                    
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    
                    const data = await response.json();

                    if (data.user) {
                        setUser(data.user);
                    } else {
                        setError("User data is not available.");
                    }
                } catch (err) {
                    setError("Failed to load user data.");
                    console.error("Fetch error:", err);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        fetchUser();
    }, [user]);

    const handleLogout = async () => {
        try {
            await axios.post('/logout', {}, { withCredentials: true });
            navigate("/login");
        } catch (err) {
            alert("Logout failed. Please try again.");
            console.error("Logout error:", err);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <header>
            <nav>
                <ul>
                    <li onClick={() => navigate("/")}>Home</li>
                    <li>Profile</li>
                    <li>Settings</li>
                    <li onClick={handleLogout}>Logout</li>
                </ul>
            </nav>
            <h1>Dashboard</h1>
            <p>Hello, {user.email}!</p>
            <p>Role: {user.role}</p>
            <p>Address: {user.address}</p>
            <p>State: {user.state}</p>
            <p>City: {user.city}</p>
            <p>Zipcode: {user.zipcode}</p>
        </header>
    );
}
