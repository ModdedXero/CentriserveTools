import React from "react";

export default function Button({ onClick, clickState, children }) {
    return (
        <input type="button" onClick={!clickState ? onClick : undefined} value={children}/>
    )
}