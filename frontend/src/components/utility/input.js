import React, { useRef } from "react";

export default function Input({ label, fancy, refVal, defaultValue, placeholder, type, onChange, required, minLength }) {
    switch (fancy) {
        case true:
            return (
                <div className="input">
                    <input ref={refVal} defaultValue={defaultValue} required={required} className="cool-input" placeholder={placeholder || " "} type={type} onChange={onChange} minLength={minLength} />
                    <label onClick={_ => refVal.current.focus()}>{label}</label>
                </div>
            )
        default:
            return (
                <div className="input">
                    <label onClick={_ => refVal.current.focus()}>{label}</label>
                    <input ref={refVal} defaultValue={defaultValue} required={required} className="cool-input" placeholder={placeholder || " "} type={type} onChange={onChange} minLength={minLength} />
                </div>
            )
    }
}