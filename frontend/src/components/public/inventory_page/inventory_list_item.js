import React, { useState } from "react";

export default function InventoryListItem({ item, index, updateCount }) {
    const [itemCount, setItemCount] = useState(0);

    function UpdateCount(count) {
        if (count < 0) return;
        setItemCount(count);
        updateCount(index, count);
    }

    return (
        <div className="inventory-item-value" key={index}>
            <p>{item.name}</p>
            <p>{item.count}</p>
            <div>
                <button onClick={_ => UpdateCount(itemCount-1)}>-</button>
                <p>{itemCount}</p>
                <button onClick={_ => UpdateCount(itemCount+1)}>+</button>
            </div>
        </div>
    )
}