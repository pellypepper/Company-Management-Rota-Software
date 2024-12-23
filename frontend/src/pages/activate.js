import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ActivateAccount = () => {
    const [message, setMessage] = useState('Activating account...');
    const navigate = useNavigate();
    const { token } = useParams();

    useEffect(() => {
        const activateAccount = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/activate/${token}`);
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || 'Activation failed');
                }

                setMessage(data.message || 'Account activated successfully!');
                setTimeout(() => navigate('/login'), 2000);
            } catch (error) {
                setMessage(`Activation failed: ${error.message}`);
            }
        };

        activateAccount();
    }, [token, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4">Account Activation</h1>
                <p className="text-gray-700">{message}</p>
            </div>
        </div>
    );
};

export default ActivateAccount;