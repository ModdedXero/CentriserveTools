import React from "react";

export default function Button({ onClick, onSubmit, disabled, type, href, children }) {
    if (type === "download") {
        return (
            <a className="btn" href={href}>
                {children}
            </a>
        )
    } else {
        return (
            <input 
                className="btn"
                type={type ? type : "button"} 
                onClick={!disabled ? onClick : undefined} 
                value={children}
            />
        )
    }
}