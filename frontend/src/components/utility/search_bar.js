import React, { useState } from "react";

export default function SearchBar({ options, setValue }) {
    const [query, setQuery] = useState("");

    function SelectItem(item) {
        setValue(item);
    }

    return (
        <div className="search-bar">
            <input className="cool-input" placeholder="Search" type="text" onChange={e => setQuery(e.target.value)} />
            <label>Search</label>
            <div className="search-bar-container">
                {
                    options.sort((a, b) => a.label.localeCompare(b.label)).filter(item => {
                        if (!query) {
                            return item;
                        } else if (item.label.toLowerCase().includes(query.toLowerCase())) {
                            return item;
                        }
                    }).map((item, index) => {
                        return (
                            <div className="search-bar-item" key={index} onClick={_ => SelectItem(item)}>
                                <div className="search-bar-icon">
                                    {item.icon && item.icon}
                                </div>
                                <div>
                                    {item.label.toUpperCase()}
                                </div>
                                <div className="search-bar-desc">
                                    {item.description && item.description}
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}