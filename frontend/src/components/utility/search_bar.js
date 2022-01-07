import React, { useRef, useState } from "react";

export default function SearchBar({ options = [], setValue, select, defaultValue, noSort, className }) {
    const [query, setQuery] = useState("");
    const [currentValue, setCurrentValue] = useState(defaultValue || {
        value: "none",
        label: select ? "Select" : "Search"
    });

    const searchBarRef = useRef();

    function OnQueryChange(e) {
        setQuery(e.target.value);
    }

    function SelectItem(item) {
        if (select) {
            searchBarRef.current.value = "";
            setQuery("");
            setCurrentValue(item)
        }
        setValue(item);
    }

    return (
        <div className={`search-bar ${className}`}>
            <input ref={searchBarRef} className="cool-input" placeholder={currentValue.label} type="text" onChange={OnQueryChange} />
            <label>{currentValue.label}</label>
            <div className="search-bar-container">
                {
                    (noSort ? options : options.sort((a, b) => a.label.localeCompare(b.label))).filter(item => {
                        if (!query) {
                            return item;
                        } else if (item.label.toLowerCase().includes(query.toLowerCase())) {
                            return item;
                        }
                        return null;
                    }).map((item, index) => {
                        return (
                            <div className="search-bar-item" key={index} onClick={_ => SelectItem(item)}>
                                <div className="search-bar-icon">
                                    {item.icon && item.icon}
                                </div>
                                <p>
                                    {item.label.toUpperCase()}
                                </p>
                                <div className="search-bar-desc">
                                    {item.description && item.description.toLowerCase()}
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}