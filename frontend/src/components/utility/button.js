import React from "react";

export default function Button({ onClick, onSubmit, clickState, type, children }) {
    return (
        <input 
            type={type ? type : "button"} 
            onClick={!clickState ? onClick : undefined} 
            value={children}
        />
    )
}