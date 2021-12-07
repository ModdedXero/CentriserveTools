import React from "react";
import { Redirect } from "react-router-dom";
import { useAuth } from "../../contexts/auth_context";

import Navbar from "../public/navbar";

export default function DynamicRoute({ component: Component , render, nonav, notsecure, adminLevel=0 }) {
    const { currentUser } = useAuth();

    if (notsecure) {
        if (nonav) {
            return (Component ? <Component /> : render());
        } else {
            return (
                <Navbar>
                    {(Component ? <Component /> : render())}
                </Navbar>
            )
        }
    } else {
        if (currentUser && currentUser.security < adminLevel) return <Redirect to="/login" />
        return (
            <Navbar>
                {currentUser ? (Component ? <Component /> : render()) : <Redirect to="/login" />}
            </Navbar>
        )
    }
}