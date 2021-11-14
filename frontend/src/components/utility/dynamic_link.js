import React from "react";
import { Link } from "react-router-dom";

export default function DynamicLink({ className, to, children }) {
    return (
        <Link className={className} to={to}>{children}</Link>
    )
}