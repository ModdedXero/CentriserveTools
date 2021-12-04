import React from "react";
import { Link } from "react-router-dom";

export default function DynamicLink({ className, to, dropdown, children }) {
    if (window.location.pathname === to) {
        className += " active";
    }

    if (dropdown && dropdown.filter(el => el.value === window.location.pathname).length > 0) {
        className += " active";
    }

    if (dropdown) {
        return (
            <div className="dropdown">
                <button className={className}>{children}</button>
                <div>
                    {dropdown.map(el => {
                        return <Link to={el.value}>{el.label}</Link>
                    })}
                </div>
            </div>
        )
    }

    return (
        <Link className={className} to={to}>{children}</Link>
    )
}