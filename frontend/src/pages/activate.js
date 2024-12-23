import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './activate.css';

const ActivateAccount = () => {
    const [debug, setDebug] = useState('Initial render');
    const [message, setMessage] = useState('Loading...');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        console.log('Component mounted'); // Initial console log

        const activateAccount = async () => {
            try {
                // Get token from URL
                const path = window.location.pathname;
                const token = path.split('/').pop();
                
                console.log('Token:', token); // Log token

                if (!token) {
                    throw new Error('No activation token found in URL');
                }

                // Check if API URL is defined
                const apiUrl = process.env.REACT_APP_API_URL;
                console.log('API URL:', apiUrl); // Log API URL

                if (!apiUrl) {
                    throw new Error('API URL is not configured');
                }

                // Make the API call
                const response = await fetch(`${apiUrl}/activate/${token}`);
                console.log('Response received:', response.status);

                if (!response.ok) {
                    if (response.status === 304) {
                        setMessage('Account already activated.');
                        return;
                    }
                    throw new Error(`Activation failed with status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Response data:', data);

                setMessage(data.message || 'Account activated successfully!');

                // Redirect after success
                setTimeout(() => {
                    navigate('/login');
                }, 2000);

            } catch (err) {
                console.error('Activation error:', err);
                setError(err.message);
                setMessage(`Activation failed: ${err.message}`);
            }
        };

        activateAccount();
    }, [navigate]);

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header text-center">
                            <h2>Account Activation</h2>
                        </div>
                        <div className="card-body">
                            {error ? (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            ) : (
                                <div className="alert alert-info" role="alert">
                                    {message}
                                </div>
                            )}
                            
                            <div className="mt-3">
                                <h5>Debug Information:</h5>
                                <pre className="bg-light p-3 mt-2" style={{ whiteSpace: 'pre-wrap' }}>
                                    {`Current Path: ${window.location.pathname}
API URL: ${process.env.REACT_APP_API_URL || 'Not configured'}
Debug Log: ${debug}`}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivateAccount;