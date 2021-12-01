import React from "react";

export default function Button({ onClick, onSubmit, disabled, type, children }) {
    return (
        <input 
            className="btn"
            type={type ? type : "button"} 
            onClick={!disabled ? onClick : undefined} 
            value={children}
        />
    )
}