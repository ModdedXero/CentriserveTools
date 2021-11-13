import React from "react";

import Navbar from "../public/navbar";

export default function DynamicRoute({ component: Component }) {
    return (
        <Navbar>
            <Component />
        </Navbar>
    )
}