import React from "react";

import DynamicLink from "./dynamic_link";
import { useAuth } from "../../contexts/auth_context";
import { Redirect } from "react-router-dom";

export default function Navbar({ children }) {
    const { currentUser } = useAuth();

    const agentsDropdown = [
        { value: "/", label: "Chart" },
        { value: "/reports", label: "Reports" }
    ]

    if (!currentUser) return <Redirect to="/login" />

    return (
        <div className="site-wrapper">
            <nav className="navbar-app">
                <img className="navbar-logo" alt="logo" src="/logo_with_name.png" />
                <ul>
                    <li>
                        <DynamicLink className="navbar-link" dropdown={agentsDropdown} to="/">
                            Agents
                        </DynamicLink>
                    </li>
                    <li>
                        <DynamicLink className="navbar-link" to="/downloads">
                            Downloads
                        </DynamicLink>
                    </li>
                    {currentUser.security >= 3 && <li>
                        <DynamicLink className="navbar-link" to="/inventory">
                            Inventory
                        </DynamicLink>
                    </li>}
                    {currentUser.security >= 5 && <li>
                        <DynamicLink className="navbar-link" to="/user-admin">
                            User Admin
                        </DynamicLink>
                    </li>}
                </ul>
            </nav>
            <div className="app-wrapper">
                {children}
            </div>
        </div>
    )
}