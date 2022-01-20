import React, { useState } from "react";
import { ContextMenu, ContextMenuTrigger, MenuItem } from "react-contextmenu";

import Input from "../../utility/input";
import InventoryCategoryItem from "./inventory_category_item";

export default function InventoryCategory({ category, location, checkout }) {
    const [showItems, setShowItems] = useState(false)

    return (
        <div className="inv-b-cats-cat">
            <ContextMenuTrigger id={`${category.name} ${location}`}>
                <div className="inv-b-cats-cat-h" onClick={_ => setShowItems(!showItems)}>
                    <h3>{category.name} ({category.amount})</h3>
                    <div className="inv-b-cats-cat-h-btn">
                        <Input
                            display="button"
                            label="Order" 
                        />
                        <Input
                            display="button"
                            label="History" 
                        />
                    </div>
                </div>
            </ContextMenuTrigger>
            <ContextMenu id={`${category.name} ${location}`}>
                <MenuItem onClick={_ => setShowItems(!showItems)}>
                    Show Items
                </MenuItem>
            </ContextMenu>
            <div className={`inv-b-cats-cat-b ${showItems ? "" : "hidden"}`}>
                {category.items.map((item, index) => {
                    return (
                        <InventoryCategoryItem 
                            item={item} 
                            category={category} 
                            location={location}
                            checkout={checkout}
                            key={index} 
                        />
                    )
                })}
            </div>
        </div>
    )
}