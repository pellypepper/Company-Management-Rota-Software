import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './hrdash.css';

const HrDashboard = () => {
    const [role, setRole] = useState('');
    const [pay, setPay] = useState('');
    const [position, setPosition] = useState('');
    const [selectedStaff, setSelectedStaff] = useState('');
    const [selectedManager, setSelectedManager] = useState('');
    const [assignedRoles, setAssignedRoles] = useState([]);
    const [staff, setStaff] = useState([]);
    const [managers, setManagers] = useState([]);
   
    const [allStaff, setAllStaff] = useState([]);

    const [allManager, setAllManager] = useState([]);
    const [activeSection, setActiveSection] = useState('dashboard');
    const navigate = useNavigate();

    useEffect(() => {
        fetchStaff();
        fetchManager();
        fetchAllStaff();
        fetchAllManager();
    }, []);

    const fetchStaff = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/staff`, {
                method: 'GET',
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setStaff(data || []);
        } catch (err) {
            console.error('Fetch error:', err);
        }
    };

    const fetchAllStaff = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/staff/all`, {
                method: 'GET',
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setAllStaff(data || []);
        } catch (err) {
            console.error('Fetch error:', err);
        }
    };

    const fetchAllManager = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/manager/info`, {
                method: 'GET',
                credentials: 'include',
            });
     
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setAllManager(data || []);
        } catch (err) {
            console.error('Fetch error:', err);
        }
    };

    const fetchManager = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/manager`, {
                method: 'GET',
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setManagers(data || []);
        } catch (err) {
            console.error('Fetch error:', err);
        }
    };

    const handleAssignRole = async () => {
        const name = role === 'staff' ? selectedStaff : selectedManager;

        if (!name || !position || !pay || !role) {
            alert('Please select a staff or manager and fill in the position and pay.');
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/addrole`, {
                name,
                position,
                role,
                pay,
            }, { withCredentials: true });

            if (response.status === 200) {
                setAssignedRoles(prevRoles => [...prevRoles, response.data]);
                alert('Role assigned successfully!');
            }
        } catch (error) {
            console.error('Error assigning role:', error);
            alert('Failed to assign role. Please try again.');
        }
    };

    const handleLogout = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/logout`, {}, { withCredentials: true });
            if (response.status === 200) {
                navigate("/");
            } else {
                alert("Logout failed. Please try again.");
            }
        } catch (err) {
            alert("Logout failed. Please try again.");
            console.error("Logout error:", err);
        }
    };

    const handleMenuClick = (section) => {
        setActiveSection(section);
    };

    const capitalizeWords = (str) => {
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    const renderStaffList = () => (
        <div className="staff-management">
            <h2>Staff List</h2>
            {allStaff.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Staff Name</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Pay/hr</th>
                            <th>Position</th>
                            <th>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allStaff.map((staffMember, index) => (
                            <tr key={staffMember.email || index}>
                                <td>{staffMember.name}</td>
                                <td>{staffMember.email}</td>
                                <td>{staffMember.address}</td>
                                <td>{staffMember.pay}</td>
                                <td>{staffMember.position}</td>
                                <td>{staffMember.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No Staff found.</p>
            )}
        </div>
    );

    const renderManagerList = () => (
        <div className="manager-management">
            <h2>Manager List</h2>
            {allManager.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Manager Name</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Pay/hr</th>
                            <th>Position</th>
                            <th>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allManager.map((manager) => (
                            <tr key={manager.id}>
                                <td>{manager.name}</td>
                                <td>{manager.email}</td>
                                <td>{manager.address}</td>
                                <td>{manager.pay}</td>
                                <td>{manager.position}</td>
                                <td>{manager.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No Managers found.</p>
            )}
        </div>
    );

    const renderRoleAssignment = () => (
        <div className="role-assignment">
            <h2>Assign Role</h2>
            <select onChange={(e) => setRole(e.target.value)} value={role}>
                <option value="">Select Role</option>
                <option value="staff">Staff</option>
                <option value="manager">Manager</option>
            </select>
            {role === 'staff' ? (
                <select onChange={(e) => setSelectedStaff(e.target.value)} value={selectedStaff}>
                    <option value="">Select Staff</option>
                    {staff.length > 0 ? (
                        staff.map(staff => (
                            <option key={staff.id} value={staff.name}>{staff.name}</option>
                        ))
                    ) : (
                        <option value="">No staff available</option>
                    )}
                </select>
            ) : role === 'manager' ? (
                <select onChange={(e) => setSelectedManager(e.target.value)} value={selectedManager}>
                    <option value="">Select Manager</option>
                    {managers.length > 0 ? (
                        managers.map(manager => (
                            <option key={manager.id} value={manager.name}>{manager.name}</option>
                        ))
                    ) : (
                        <option value="">No managers available</option>
                    )}
                </select>
            ) : null}
            <label>
                Pay:
                <input type="number" placeholder="Pay" value={pay} onChange={(e) => setPay(e.target.value)} />
            </label>
            <label>
                Position:
                <input
                    type="text"
                    placeholder="Position"
                    value={position}
                    onChange={(e) => setPosition(capitalizeWords(e.target.value))}
                />
            </label>
            <button onClick={handleAssignRole}>Assign Role</button>
            <ul>
                {assignedRoles.map((roleAssignment, index) => (
                    <li key={index}>
                        {roleAssignment.name} - {roleAssignment.position} - {roleAssignment.pay}
                    </li>
                ))}
            </ul>
        </div>
    );
   


    return (
        <div className="app">
            <nav className="navbar">
                <h1>HR Dashboard</h1>
                <ul>
                    <li><Link to="#" onClick={() => handleMenuClick('dashboard')}>Dashboard</Link></li>
                    <li><Link to="#" onClick={() => handleMenuClick('staff')}>Staff</Link></li>
                    <li><Link to="#" onClick={() => handleMenuClick('managers')}>Managers</Link></li>
                    <li><Link to="#" onClick={() => handleMenuClick('assign-roles')}>Assign Roles</Link></li>
                </ul>
            </nav>
            <div className="main-content">
                <div className="sidebar">
                    <h2>Menu</h2>
                    <ul>
                        <li><Link to="#" onClick={() => handleMenuClick('dashboard')}>Dashboard</Link></li>
                        <li><Link to="#" onClick={() => handleMenuClick('staff')}>Staff Management</Link></li>
                        <li><Link to="#" onClick={() => handleMenuClick('managers')}>Manager Management</Link></li>
                        <li><Link to="#" onClick={() => handleMenuClick('assign-roles')}>Role Assignment</Link></li>
                        <li><Link to="#" onClick={handleLogout}>Sign Out</Link></li>
                    </ul>
                </div>
                <div className="content">
                    {activeSection === 'dashboard' && (
                        <div className="dashboard">
                            <h1>Welcome to the HR Dashboard</h1>
                            <p>Manage your staff and managers effectively!</p>
                        </div>
                    )}
                    {activeSection === 'staff' && renderStaffList()}
                    {activeSection === 'managers' && renderManagerList()}
                    {activeSection === 'assign-roles' && renderRoleAssignment()}
                </div>
            </div>
        </div>
    );
};

export default  HrDashboard;
