import React, { useRef } from "react";

export default function Input({ label, fancy, refVal, placeholder, type, onChange, required, minLength }) {
    switch (fancy) {
        case true:
            return (
                <div>
                    <input ref={refVal} required={required} className="cool-input" placeholder={placeholder} type={type} onChange={onChange} minLength={minLength} />
                    <label onClick={_ => refVal.current.focus()}>{label}</label>
                </div>
            )
        default:
            return (
                <div>
                    <label onClick={_ => refVal.current.focus()}>{label}</label>
                    <input ref={refVal} required={required} className="cool-input" placeholder={placeholder} type={type} onChange={onChange} minLength={minLength} />
                </div>
            )
    }
}