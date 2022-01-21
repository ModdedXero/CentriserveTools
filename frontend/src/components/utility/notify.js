import React, { useEffect, useState } from "react";
import ReactDom from "react-dom";

export default function Notify({ data, setData, error, lifetime=5 }) {
    const [visible, setVisible] = useState(false);
    const [firstRender, setFirstRender] = useState(true);

    useEffect(() => {
        if (!data) return;
        
        setFirstRender(false);
        setVisible(true);
        setTimer(lifetime);
    }, [data]);

    function setTimer(delay) {
        setTimeout(() => { setVisible(false); setData(null); }, delay * 1000);
    }

    if (firstRender) return null;
    return ReactDom.createPortal(
        <div 
            className={`notify-background ${visible ? "" : "closing"} ${error ? "error" : ""}`}
        >
            <textarea key={data} defaultValue={data} readOnly />
        </div>,
        document.getElementById("notifyPortal")
    )
}