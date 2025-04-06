import React, { useState , useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import "./login.css";
import Spinner from "../../components/spinner";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(true)
    const navigate = useNavigate();
 
    const apiUrl = process.env.REACT_APP_API_URL || "https://localhost:10000";

    useEffect(() => {
      
        
        const timer = setTimeout(() => {
           
            setSubmitting(false);
        }, 1000); 

      
        return () => {
         
            clearTimeout(timer);
        };
    }, []); 


   

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password || !role) {
            alert("Please fill in all fields.");
            return;
        }

        const user = { email, password, role };
        setLoading(true);



        try {
        
            const response = await axios.post(`${apiUrl}/auth/login`, user, { withCredentials: true,  headers: {
                'Content-Type': 'application/json'
              } });
    
            if (response.data.redirect) {
                sessionStorage.setItem("user", JSON.stringify(response.data.user));
                navigate(response.data.redirect, { state: { user: response.data.user } });
            } else {
                alert("Login successful, but no redirect specified.");
            }
        } catch (error) {

            alert(error.response?.data?.message || "Login failed. Please try again.");
        } finally {
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
        <main className="login-container bg-dark">
            <div className="container px-4 vh-100">
                <div className="row h-auto">
                    <div className="login-wrapper col-12">
                        <div className="login-text rounded-bottom-5 text-center">
                            <p className="display-5">Login</p>
                        </div>
                        <form className="login-form" onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <select
                                    className="form-select"
                                    id="role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Choose Role</option>
                                    <option value="hr">Hr</option>
                                    <option value="manager">Manager</option>
                                    <option value="staff">Staff</option>
                                </select>
                            </div>
                            <div className="mb-3 form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="rememberMe"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor="rememberMe">Remember Me</label>
                            </div>
                            <button type="submit" className="btn mt-3" disabled={loading}>
                                {loading ? "Logging in..." : "Login"}
                            </button>
                            <p className="mt-2">
                                Don't have an account? <Link className="login-p" to="/register">Register here</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}
