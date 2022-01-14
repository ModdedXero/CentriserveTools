import React, { useEffect, useState } from "react";
import ReactDom from "react-dom";

export default function Notify({ children, lifetime=5 }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        setTimer(lifetime);
    }, []);

    function setTimer(delay) {
        setTimeout(() => setVisible(false), delay * 1000);
    }

    return ReactDom.createPortal(
        <div className={`notify-background ${visible ? "" : "closing"}`}>
            <p>{children}</p>            
        </div>,
        document.getElementById("notifyPortal")
    )
}