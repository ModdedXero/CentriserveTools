import React from "react";

export function Form({ className, children, onSubmit }) {


    return (
        <form className={className ? className : "modal-form"} onSubmit={onSubmit}>
            {children}
        </form>
    )
}

export function FormInput({ type }) {
    return (
        <div className={`form-input ${type}`}>

        </div>
    )
}