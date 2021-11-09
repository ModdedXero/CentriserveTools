import React from "react";
import ReactDom from "react-dom";

export default function Notify({ children }) {
    return ReactDom.createPortal(
        <div className="notify-background">
            <p>{children}</p>            
        </div>,
        document.getElementById("notifyPortal")
    )
}