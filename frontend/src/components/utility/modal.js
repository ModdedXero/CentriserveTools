import React from "react";
import ReactDom from "react-dom";
import Button from "./button";

export default function Modal({ visible, onClose, children }) {
    if (!visible) return null;

    return ReactDom.createPortal(
        <div className="modal" onContextMenu={(e) => e.stopPropagation()}>
            <div className="modal-content">
                <Button className="btn-borderless modal-close" onClick={_ => onClose(false)}>X</Button>
                {children}
            </div>
        </div>,
        document.getElementById("modalPortal")
    )
}