// components/spinner/index.jsx
import React from "react";
import "./spinner.css";

export default function Spinner() {
    return (
        <div className="spinner-container">
            <div className="spinner"></div>
            <div className="spinner-text">Loading...</div>
        </div>
    );
}