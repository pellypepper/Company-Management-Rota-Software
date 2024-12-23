import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ActivateAccount = () => {
    const [debug, setDebug] = useState('Initial render');
    const [message, setMessage] = useState('Loading...');
    const navigate = useNavigate();

    // Add this console.log outside useEffect to verify component renders
    console.log('Component rendering');

    useEffect(() => {
        console.log('Effect running'); // Verify effect triggers
        
        // Define async function
        const activateAccount = async () => {
            console.log('Activation function starting');
            try {
                const path = window.location.pathname;
                const token = path.split('/').pop();
                
                console.log('Token:', token);

                const response = await fetch(`${process.env.REACT_APP_API_URL}/activate/${token}`);
                console.log('Response:', response.status);

                if (!response.ok) {
                    if (response.status === 304) {
                        setMessage('Account already activated or no changes made.');
                        return;
                    }
                    throw new Error('Failed to activate account');
                }

                const data = await response.json();
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

        // Immediately call the function
        activateAccount();

        // Add a cleanup function
        return () => {
            console.log('Cleanup running');
        };
    }, []); // Empty dependency array

    // Return immediate visual feedback
    return (
        <div style={{ 
            padding: '20px',
            maxWidth: '600px',
            margin: '40px auto',
            textAlign: 'center',
            border: '1px solid #ccc',
            borderRadius: '8px',
            backgroundColor: '#fff'
        }}>
            <h1>Account Activation Page</h1>
            <p>{message}</p>
            <div style={{
                marginTop: '20px',
                padding: '10px',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px'
            }}>
                <p>Current Path: {window.location.pathname}</p>
                <p>Debug Info: {debug}</p>
            </div>
        </div>
    );
};

export default ActivateAccount;