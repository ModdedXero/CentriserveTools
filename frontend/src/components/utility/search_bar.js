import React, { useEffect, useRef, useState } from "react";
import Input from "./input";

export default function SearchBar({ options = [], setValue, select, defaultValue, noSort, className }) {
    const [query, setQuery] = useState("");
    const [currentValue, setCurrentValue] = useState(defaultValue || {
        value: "none",
        label: select ? "Select" : "Search"
    });
    const [parsedOptions, setParsedOptions] = useState([]);

    const searchBarRef = useRef();

    useEffect(() => {
        if (!options.length) return null;
        const retOptions = [];

        for (const opt of options) {
            if (opt.value)
                retOptions.push(opt);
            else
                retOptions.push({
                    value: opt,
                    label: opt
                });
        }

        setParsedOptions(retOptions);
    }, [options])

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
            <Input label={currentValue.label} fancy refVal={searchBarRef} placeholder={currentValue.label} type="text" onChange={OnQueryChange}/>
            <div className="search-bar-container">
                {
                    (noSort ? parsedOptions : parsedOptions.sort((a, b) => a.label.localeCompare(b.label))).filter(item => {
                        if (!query) {
                            return item;
                        } else if (item.label.toLowerCase().includes(query.toLowerCase())) {
                            return item;
                        }
                        return null;
                    }).map((item, index) => {
                        return (
                            <div className="search-bar-item" key={index} onClick={_ => SelectItem(item)}>
                                {item.icon && <div className="search-bar-icon">
                                    {item.icon}
                                </div>}
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