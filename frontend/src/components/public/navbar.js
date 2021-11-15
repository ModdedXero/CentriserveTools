import React from "react";

import DynamicLink from "../utility/dynamic_link";

export default function Navbar({ children }) {

    return (
        <div className="site-wrapper">
            <nav className="navbar-app">
                <DynamicLink className="navbar-logo" to="/">
                    <img src="/logo_with_name.png" />
                </DynamicLink>
                <ul>
                    <li><DynamicLink className="navbar-link" to="/">Device Charts</DynamicLink></li>
                    <li><DynamicLink className="navbar-link" to="/reports">Reports</DynamicLink></li>
                </ul>
            </nav>
            <div className="app-wrapper">
                {children}
            </div>
        </div>
    )
}