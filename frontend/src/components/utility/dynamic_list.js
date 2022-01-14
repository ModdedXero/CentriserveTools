import React, { useRef, useState } from "react";
import Input from "./input";

export default function DynamicList({ options = [], ref, label, noSort, noDup=true }) {
    const [internalList, setInteralList] = useState(options || []);
    const [query, setQuery] = useState("");
    const listInputRef = useRef();

    function OnQueryChange(e) {
        setQuery(e.target.value);
    }

    function AddItem() {
        if (noDup)
            if (internalList.filter(e => e === listInputRef.current.value).length > 0)
                return;
        internalList.push(listInputRef.current.value);
        setQuery("");
        listInputRef.current.value = "";
        ref.current = internalList;
    }

    function RemoveItem(index) {
        const listCopy = [...internalList];
        listCopy.splice(index, 1);
        setInteralList(listCopy);
        ref.current = internalList;
    }

    return (
        <div className="list">
            <div className="list-header">
                <Input label={label} refVal={listInputRef} type="text" onChange={OnQueryChange}/>
                <Input display="button" fancy onClick={AddItem} label="Add" />   
            </div>
            <div className="list-container">
                {
                    (noSort ? internalList : internalList.sort((a, b) => a.localeCompare(b))).filter(item => {
                        if (!query) {
                            return item;
                        } else if (item.toLowerCase().includes(query.toLowerCase())) {
                            return item;
                        }
                        return null;
                    }).map((item, index) => {
                        return (
                            <div className="list-container-item" key={index}>
                                <p>
                                    {item}
                                </p>
                                <Input 
                                    display="button" 
                                    fancy 
                                    label="Remove"
                                    onClick={_ => RemoveItem(index)}
                                />
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}