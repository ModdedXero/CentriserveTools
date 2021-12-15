import React from "react";

import DynamicLink from "./dynamic_link";

export default function Navbar({ children }) {
    const agentsDropdown = [
        { value: "/", label: "Chart" },
        { value: "/reports", label: "Reports" }
    ]

    return (
        <div className="site-wrapper">
            <nav className="navbar-app">
                <img className="navbar-logo" src="/logo_with_name.png" />
                <ul>
                    <li><DynamicLink className="navbar-link" dropdown={agentsDropdown} to="/">Agents</DynamicLink></li>
                    <li><DynamicLink className="navbar-link" to="/downloads">Downloads</DynamicLink></li>
                </ul>
            </nav>
            <div className="app-wrapper">
                {children}
            </div>
        </div>
    )
}