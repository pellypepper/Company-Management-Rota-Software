import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ActivateAccount = () => {
    const [debug, setDebug] = useState('Initial render');
    const [message, setMessage] = useState('Loading...');
    const navigate = useNavigate();

    useEffect(() => {
        const activateAccount = async () => {
            setDebug('Starting activation...');
            console.log('Starting account activation');

            try {
                // Get token from URL
                const path = window.location.pathname;
                const token = path.split('/').pop();
                
                console.log('Using token:', token);
                setDebug(prev => prev + '\nToken: ' + token);

                // Make the API call
                const response = await fetch(`${process.env.REACT_APP_API_URL}/activate/${token}`);
                
                console.log('Response status:', response.status);
                console.log('Response headers:', response.headers);
                
                if (!response.ok) {
                    // Handle specific error responses
                    if (response.status === 304) {
                        setMessage('Account already activated or no changes made.');
                        setDebug(prev => prev + '\nAccount already activated or no changes made.');
                        return;
                    } else {
                        throw new Error('Failed to activate account: ' + response.status);
                    }
                }

                const data = await response.json();
                
                console.log('Server response:', data);
                setDebug(prev => prev + '\nServer response: ' + JSON.stringify(data));

                // Set the message
                setMessage(data.message || 'No message from server');

                // Redirect to login page after 2 seconds if activation is successful
                setTimeout(() => {
                    navigate('/login'); // Navigate to the login page
                }, 2000);

            } catch (error) {
                console.error('Error:', error);
                setDebug(prev => prev + '\nError: ' + error.message);
                setMessage('Error during activation: ' + error.message);
            }
        };

        activateAccount();
    }, [navigate]);

    return (
        <div style={{ margin: '20px', textAlign: 'center' }}>
            <h1>Account Activation</h1>
            
            <p style={{ 
                padding: '10px', 
                border: '1px solid #ccc',
                margin: '10px 0'
            }}>
                Message: {message}
            </p>

            <pre style={{ 
                textAlign: 'left',
                background: '#f0f0f0',
                padding: '10px',
                margin: '10px 0'
            }}>
                Debug Info:
                {debug}
            </pre>
        </div>
    );
};

export default ActivateAccount;
