import React from "react";

export default function Button({ onClick, onSubmit, className, disabled, type, href, children }) {
    return (
        <button 
            className={className ? className : "btn"}
            onClick={!disabled ? onClick : undefined}
            type={type ? type : "button"}
        >
            {children}
        </button>
    )
}