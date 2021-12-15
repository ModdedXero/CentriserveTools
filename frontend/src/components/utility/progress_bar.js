import React from "react";

export default function ProgressBar({ progress }) {
    return (
        <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }}>
            </div>
            <p>{progress}%</p>
        </div>
    )
}