import React from "react";

export default function Button({ onClick, onSubmit, className, disabled, type, borderless, children }) {
    function getClassName() {
        if (className) {
            return className;
        } else if (borderless) {
            return "btn-borderless"
        } else {
            return "btn"
        }
    }

    return (
        <button 
            className={getClassName()}
            onClick={!disabled ? onClick : undefined}
            type={type ? type : "button"}
        >
            {children}
        </button>
    )
}