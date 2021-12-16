import React from "react";

export default function Dropdown({ visible, className, children }) {
    if (!visible) return null;

    return (
        <div className={className}>
            {children}
        </div>
    );
}