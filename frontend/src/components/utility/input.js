import React, { useRef } from "react";
import Button from "./button";

import SearchBar from "./search_bar";
import DynamicList from "./dynamic_list";

export default function Input({ 
    label, 
    fancy, 
    display,
    values,
    refVal, 
    defaultValue, 
    placeholder, 
    type, 
    onChange,
    onClick,
    required, 
    minLength 
}) {
    switch (display) {
        case "dropdown":
            return (
                <div className="input">
                    <label onClick={_ => refVal.current.focus()}>{label}</label>
                    <SearchBar
                        noSort
                        select
                        options={values}
                        setValue={i => {
                            if (refVal)
                                refVal.current = i.value;
                            if (onChange)
                                onChange(i.value);
                        }}
                        defaultValue={defaultValue}
                    />
                </div>
            )
        case "button":
            return (
                <Button borderless={fancy} onClick={onClick} type={type}>
                    {label}
                </Button>
            )
        case "checkbox":
            return (
                <label className="checkbox">{label}
                    <input 
                        ref={refVal} 
                        type="checkbox" 
                        checked={defaultValue}
                        required={required}
                        onChange={onChange}
                    />
                    <span className="checkmark"></span>
                </label>
            )
        case "list":
            return (
                <DynamicList
                    options={values}
                    label={label}
                    noSort
                    ref={refVal}
                />
            )
        default:
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
}