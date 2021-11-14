import React from "react";

import DynamicLink from "../utility/dynamic_link";

export default function Navbar({ children }) {

    return (
        <nav className="navbar-app">
            <DynamicLink className="navbar-link" to="/">Home</DynamicLink>
            <h2 className="navbar-logo">Centriserve</h2>
            <div className="app-wrapper">
                {children}
            </div>
        </nav>
    )
}