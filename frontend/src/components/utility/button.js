import React from "react";

export default function Button({ onClick, onSubmit, className, disabled, type, href, children }) {

    return (
        <input 
            className={className ? className : "btn"}
            type={type ? type : "button"} 
            onClick={!disabled ? onClick : undefined} 
            value={children}
        />
    )
}