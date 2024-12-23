import React, { useState, useEffect } from "react";
import axios from "axios";
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import './register.css';
import Spinner from '../../components/spinner';





export default function RegisterPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: ''.toLowerCase(),
        address: '',
        city: '',
        state: '',
        zipcode: '',
        role: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(true);
    const [error, setError] = useState('');
    const [confirmationMessage, setConfirmationMessage] = useState(''); 
    const [agreed, setAgreed] = useState(false);
  

    
    useEffect(() => {
      
        
        const timer = setTimeout(() => {
         
            setSubmitting(false);
        }, 1000); 

        
        return () => {
           
            clearTimeout(timer);
        };
    }, []); 

    const capitalizeFirstLetter = (string) => {
        if (!string) return ''; 
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Capitalize first name and last name
        const updatedValue = 
            name === 'firstName' || name === 'lastName'
                ? capitalizeFirstLetter(value)
                : name === 'email'
                ? value.toLowerCase() 
                : value;

        setFormData((prevData) => ({
            ...prevData,
            [name]: updatedValue,
        }));
        

        if (error) setError('');
        if (confirmationMessage) setConfirmationMessage('');
    };

    const validateForm = () => {
        if (!agreed) {
            setError('Please agree to the terms and conditions');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }
    
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setConfirmationMessage(''); 

        if (!validateForm()) {
            return;
        }

        const { password, confirmPassword, ...userDetails } = formData;
        const newUser = { ...userDetails, password };

        try {
            setLoading(true);
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/register`, newUser, { 
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

           
            setConfirmationMessage("Registration successful! Please check your email to activate your account.");

            if (response) {
                sessionStorage.setItem("user", JSON.stringify(response.data.user));
                setConfirmationMessage("Registration successful! Please check your email to activate your account.");
            } else {
                setError("Invalid redirect URL. Please contact support.");
            }
        } catch (error) {
            console.error("Registration error:", error);
            setError(error.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const renderInputField = (label, name, type = "text", placeholder = "") => (
        <Form.Group as={Col} md="6" controlId={name}>
            <Form.Label>{label}</Form.Label>
            <Form.Control
                type={type}
                placeholder={placeholder}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                required
                isInvalid={error && name === 'password' && type === 'password'}
            />
            {error && name === 'password' && type === 'password' && (
                <Form.Control.Feedback type="invalid">
                    {error}
                </Form.Control.Feedback>
            )}
        </Form.Group>
    );
    if(loading || submitting) {
        return <Spinner />;
    }


    return (
        <main className="register-container px-4 py-4 bg-dark">
            <div className="container">
                <div className="row h-auto">
                    <div className="col-12 col-md-6 signup-1">
                        <img 
                            className="img" 
                            src="/task.png" 
                            alt="Task Management" 
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'fallback-image.png';
                            }}
                        />
                        <h1 className="text-left">Task Management</h1>
                        <p>We keep track of our employees' tasks and progress.</p>
                    </div>

                    <div className="signup-wrapper col-12 col-md-6">
                        <div className="login-text rounded-bottom-5 text-center">
                            <p className="display-5">Register</p>
                        </div>
 
                        <Form noValidate onSubmit={handleSubmit}>
                            <Row className="mb-3 mt-5">
                                {renderInputField("First Name", "firstName", "text", "First name")}
                                {renderInputField("Last Name", "lastName", "text", "Last name")}
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col} md="12" controlId="email">
                                    <Form.Label>Email</Form.Label>
                                    <InputGroup hasValidation>
                                        <InputGroup.Text>@</InputGroup.Text>
                                        <Form.Control
                                            type="email"
                                            placeholder="Email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            isInvalid={error && error.includes('email')}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {error && error.includes('email') && error}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>
                            </Row>
                          
                            <Row className="mb-3">
                                {renderInputField("Password", "password", "password", "Password")}
                                {renderInputField("Confirm Password", "confirmPassword", "password", "Confirm Password")}
                            </Row>
                            <Row className="mb-3">
                            {renderInputField("Address", "address", "text", "Address")}
                                {renderInputField("City", "city", "text", "City")}
                                {renderInputField("State", "state", "text", "State")}
                                {renderInputField("Zipcode", "zipcode", "text", "Zipcode")}
                            </Row>
                            <Form.Group className="mb-3">
                                <Form.Label>Role</Form.Label>
                                <Form.Select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>Choose Role</option>
                                    <option value="hr">Hr</option>
                                    <option value="manager">Manager</option>
                                    <option value="staff">Staff</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="text-center mt-4">
                                <Form.Check
                                    required
                                    label="Agree to terms and conditions"
                                    checked={agreed}
                                    onChange={(e) => setAgreed(e.target.checked)}
                                />
                            </Form.Group>
                            <button 
                                type="submit" 
                                className="btn btn-primary mt-3 w-100" 
                                disabled={loading}
                            >
                                {loading ? "Registering..." : "Register"}
                            </button>
                            {error && <Alert variant="danger">{error}</Alert>}
                        {confirmationMessage && <Alert variant="success">{confirmationMessage}</Alert>} {/* Confirmation message */}
                        </Form>
                    </div>
                </div>
            </div>
        </main>
    );
}
