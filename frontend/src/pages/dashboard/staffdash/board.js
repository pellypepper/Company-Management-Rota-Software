import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import './staffdash.css';

export default function Maindash() {
    const { user } = useOutletContext();
    const [nextShift, setNextShift] = useState(null);
    const [error, setError] = useState(null);

    const getDate = () => {
        return new Date().toDateString();
    };

    useEffect(() => {
        const fetchNextShift = async () => {
            try {
                const response = await fetch(`http://localhost:3000/staff/${user.id}/next-shift`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setNextShift(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchNextShift();
    }, [user.id]);

    return (
        <main className="board-wrapper">
             <h1>Rota Plan System </h1>
            <section className="dash-content-wrapper">
                <div className="dash-content">
                    <div>
                        <h2>Hi {user.name}</h2>
                        <p>Welcome to the dashboard</p>
                    </div>
                    <p className="date">{getDate()}</p>
                </div>
            </section>

            <section className="dash-current-shift">
                <div className="shift-details">
                    <h2>Next Shift</h2>
                    {error && <p className="error-message">Error: {error}</p>}
                    {nextShift ? (
                        <>
                            <p>Shift: {nextShift.shiftType || 'Morning'}</p>
                            <p> {nextShift.position}</p>
                            <div>
                                <p>Start Time: {nextShift.shiftstart}</p>
                                <p>End Time: {nextShift.shiftend}</p>
                            </div>
                            <button>Clock in</button>
                        </>
                    ) : (
                        <p>No upcoming shifts found.</p>
                    )}
                </div>
            </section>
        </main>
    );
}
