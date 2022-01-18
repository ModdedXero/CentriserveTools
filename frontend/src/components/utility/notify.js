import React, { useEffect, useState } from "react";
import ReactDom from "react-dom";

export default function Notify({ children, value, error, lifetime=5 }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        setVisible(true);
        setTimer(lifetime);
    }, [value]);

    function setTimer(delay) {
        setTimeout(() => setVisible(false), delay * 1000);
    }

    return ReactDom.createPortal(
        <div 
            className={`notify-background ${visible ? "" : "closing"} ${error ? "error" : ""}`}
        >
            <textarea defaultValue={children} readOnly />         
        </div>,
        document.getElementById("notifyPortal")
    )
}