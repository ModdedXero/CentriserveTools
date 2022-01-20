import React, { useState } from "react";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

import InventoryEditItem from "./inventory_edit_item";

export default function InventoryCategorySubItem({ location, category, item, itemName, parseField, checkout }) {
    const [editSubItem, setEditSubItem] = useState(false);

    return (
        <div>
            <ContextMenuTrigger id={`subItem ${item._id} ${category.name}`}>
                <div className="inv-b-cats-cat-item-list-item">
                    <div className="inv-b-cats-cat-item-topleft">
                        {itemName}
                    </div>
                    {item.fields.map((subField, index2) => {
                        return parseField(subField, index2);
                    })}
                </div>
            </ContextMenuTrigger>
            <ContextMenu id={`subItem ${item._id} ${category.name}`}>
                <MenuItem onClick={_ => setEditSubItem(true)}>
                    Edit Item
                    <InventoryEditItem 
                        location={location} 
                        category={category} 
                        item={item}
                        itemName={itemName}
                        modal={editSubItem} 
                        setModal={setEditSubItem} 
                    />
                </MenuItem>
                <MenuItem onClick={_ => checkout(category.name, item, itemName)}>
                    Checkout Item
                </MenuItem>
            </ContextMenu>
        </div>
    )
}