import React, { useState } from "react";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

import InventoryEditItem from "./inventory_edit_item";
import { Variable, APIs } from "../../utility/variable";

const categoryVar = new Variable(APIs.Inventory + "/categories", false);

export default function InventoryCategoryItem({ item, category, location }) {
    const [showList, setShowList] = useState(false);
    const [editItem, setEditItem] = useState(false);

    const cat = categoryVar.useVar(category.name, null);

    function parseHeaderFields(field, index) {
        let content;

        if (field.actionValue) field.value = field.actionValue;

        if (field.type === "Checkbox") {
            if (field.value === "true") field.value = "Yes"
            if (field.value === "false") field.value = "No"
        } else if (field.action === "Total") {
            field.value = item.amount || item.shelf.length;
        } else if (field.action === "Sum") {
            field.value = 0;
            for (const subItem of item.shelf) {
                for (const subItemField of subItem.fields) {
                    if (subItemField.label === field.actionValue) {
                        field.value += parseFloat(subItemField.value);
                    }
                }
            }
        }

        if (field.showLabel) {
            content = `${field.label}: ${field.value}`
        } else {
            content = field.value;
        }

        if (field.position === "Top Right") {
            return (
                <div className="inv-b-cats-cat-item-topright" key={index}>
                    {content}
                </div>
            )
        } else if (field.position === "Bottom Left") {
            return (
                <div className="inv-b-cats-cat-item-botleft" key={index}>
                    {content}
                </div>
            )
        } else if (field.position === "Bottom Right") {
            return (
                <div className="inv-b-cats-cat-item-botright" key={index}>
                    {content}
                </div>
            )
        }
    }

    return (
        <div>
            <ContextMenuTrigger id={`item ${item.name} ${category.name}`}>
                <div className="inv-b-cats-cat-item" onClick={_ => setShowList(!showList)}>
                    <div className="inv-b-cats-cat-item-topleft">
                        {item.name}
                    </div>
                    {cat && cat.fields.map((field, index) => {
                        if (field.header) return parseHeaderFields(field, index);
                    })}
                </div>
            </ContextMenuTrigger>
            <ContextMenu id={`item ${item.name} ${category.name}`}>
                {(cat && cat.collapsed) && 
                <MenuItem onClick={_ => setEditItem(true)}>
                    Edit Item
                    <InventoryEditItem 
                        location={location} 
                        category={category} 
                        item={item.shelf[0]}
                        itemName={item.name}
                        modal={editItem} 
                        setModal={setEditItem} 
                    />
                </MenuItem>}
                {(cat && !cat.collapsed) && 
                <MenuItem onClick={_ => setShowList(!showList)}>
                    Show List
                </MenuItem>}
            </ContextMenu>
            <div className={`inv-b-cats-cat-item-list ${!showList ? "hidden" : ""}`}>
                    {(cat && !cat.collapsed) && item.shelf.map((subItem, index1) => {
                        return (
                            <div className="inv-b-cats-cat-item-list-item" key={index1}>
                                <div className="inv-b-cats-cat-item-topleft">
                                    {item.name}
                                </div>
                                {subItem.fields.map((subField, index2) => {
                                    return parseHeaderFields(subField, index2);
                                })}
                            </div>
                        )
                    })}
                </div>
        </div>
    )
}