import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ActivateAccount = () => {
    const [debug, setDebug] = useState('Initial render');
    const [message, setMessage] = useState('Loading...');
    const navigate = useNavigate();

    // Log to verify component is rendering
    console.log('Component rendering');

    useEffect(() => {
        console.log('Effect running');

        // Define async function
        const activateAccount = async () => {
            console.log('Activation function starting');

            try {
                // Get the token from the URL
                const path = window.location.pathname;
                const token = path.split('/').pop();

                console.log('Token:', token);

                // Make the API call
                const response = await fetch(`${process.env.REACT_APP_API_URL}/activate/${token}`);
                console.log('Response:', `${process.env.REACT_APP_API_URL}/activate/${token}`);
                console.log('Response:', response.status);

                // Check response status
                if (!response.ok) {
                    if (response.status === 304) {
                        setMessage('Account already activated or no changes made.');
                        return;
                    }
                    throw new Error('Failed to activate account: ' + response.statusText);
                }

                // Parse JSON data
                const data = await response.json();
                console.log('Data received:', data);
                
                // Set the success message
                setMessage(data.message || 'Account activated successfully!');

                // Redirect after success
                setTimeout(() => {
                    navigate('/login');
                }, 2000);

            } catch (error) {
                console.error('Error:', error);
                setMessage('Error during activation: ' + error.message);
            }
        };

        // Call the activation function
        activateAccount();

        // Cleanup function
        return () => {
            console.log('Cleanup running');
        };
    }, [navigate]); // Use navigate as a dependency

    return (
        <div style={{ margin: '20px', textAlign: 'center' }}>
            <h1>Account Activation Page</h1>
            <p style={{ padding: '10px', border: '1px solid #ccc', margin: '10px 0' }}>
                Message: {message}
            </p>
            <p>Current Path: {window.location.pathname}</p>
            <pre style={{ textAlign: 'left', background: '#f0f0f0', padding: '10px', margin: '10px 0' }}>
                Debug Info: {debug}
            </pre>
        </div>
    );
};

export default ActivateAccount;
