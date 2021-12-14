import React, { useState } from "react";
import ReactDom from "react-dom";

import Button from "./button";

export default function PopNotify({ children, visible, setVisible }) {

    if (visible) {
        return ReactDom.createPortal(
            <div className="modal" onContextMenu={(e) => e.stopPropagation()}>
                <div className="modal-content">
                    <Button className="btn modal-close" onClick={_ => setVisible(false)}>X</Button>
                    {children}
                </div>
            </div>,
            document.getElementById("modalPortal")
        )
    } else {
        return (
            <div className="pop-open">
                <button onClick={_ => setVisible(true)}>
                    <i className="fas fa-file-upload" />
                </button>
            </div>
        )
    }
}