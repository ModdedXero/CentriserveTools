import React, { useState } from "react";

import InventoryListItem from "./inventory_list_item";

export default function InventoryCategoryList({ location, category, checkout, items }) {
    const [filterItems, setFilteredItems] = useState(FilteredItems);

    function FilteredItems() {
        const retItems = [];

        let currentGroup = {
            name: "",
            price: 0,
            items: [],
            serial: false,
            amount: 0
        };

        for (let i = 0; i < items.length; i++) {
            currentGroup.serial = items[i].serial ? true : false;
            
            if (retItems.filter(e => e.name === items[i].name).length) {
                for (let j = 0; j < retItems.length; j++) {
                    for (let k = 0; k < retItems[j].items.length; k++) {
                        if (retItems[j].items[k].name === items[i].name) {
                            retItems[j].items.push(items[i]);
                            retItems[j].amount += items[i].amount || 1;
                            break;
                        }
                    }
                }
            } else {
                currentGroup.name = items[i].name;
                currentGroup.price = items[i].price;
                currentGroup.serial = items[i].serial || false;
                currentGroup.amount = items[i].amount || 1;
                currentGroup.items.push(items[i]);

                retItems.push(currentGroup);
                currentGroup = {
                    name: "",
                    price: 0,
                    items: [],
                    serial: false,
                    amount: 0
                };
            }
        }
        
        return retItems;
    }

    return (
        <div className="inventory-items-list">
            {filterItems.map((group, index) => {
                return (
                    <InventoryListItem
                        location={location}
                        category={category}
                        group={group}
                        checkout={checkout}
                        key={index} 
                        id={index}
                    />
                )
            })}
        </div>
    )
}