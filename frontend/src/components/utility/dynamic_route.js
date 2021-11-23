import React from "react";
import { Redirect } from "react-router-dom";
import { useAuth } from "../../contexts/auth_context";

import Navbar from "../public/navbar";

export default function DynamicRoute({ component: Component, nonav, notsecure }) {
    const { currentUser } = useAuth();

    if (!notsecure) {
        return (
            <Navbar>
                <Component />
            </Navbar>
        )
    } else {
        return (
            <Navbar>
                {currentUser ? <Component /> : <Redirect to="/login" />}
            </Navbar>
        )
    }
}