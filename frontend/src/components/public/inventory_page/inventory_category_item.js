import React, { useState } from "react";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

import InventoryEditItem from "./inventory_edit_item";
import { Variable, APIs } from "../../utility/variable";
import InventoryCategorySubItem from "./inventory_category_sub_item";
import Input from "../../utility/input";

const categoryVar = new Variable(APIs.Inventory + "/categories", false);

export default function InventoryCategoryItem({ item, category, location, checkout }) {
    const [showList, setShowList] = useState(false);
    const [editItem, setEditItem] = useState(false);

    const [checkoutAmount, setCheckoutAmount] = useState(0);

    const cat = categoryVar.useVar(category.name, null);

    function parseHeaderFields(field, index) {
        let content;

        if (field.actionValue) field.value = field.actionValue;

        if (field.type === "Checkbox") {
            if (field.value === "true") field.value = "Yes"
            if (field.value === "false") field.value = "No"
        } else if (field.action === "Total") {
            field.value = (item.hasOwnProperty("amount") && category.collapsed)
                ? item.amount : item.shelf.length;
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

    function CheckCheckoutCount(e) {
        if (e.target.value < 0) {
            setCheckoutAmount(0);
        } else if (e.target.value > item.amount) {
            setCheckoutAmount(item.amount);
        } else {
            setCheckoutAmount(e.target.value);
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
                {(cat && cat.collapsed) && 
                <MenuItem 
                    onClick={_ => {
                        checkout(category, { 
                            item: item.shelf[0], 
                            name: item.name,
                            amount: parseInt(checkoutAmount)
                        });

                        setCheckoutAmount(0);
                    }}
                >
                    Checkout Item
                </MenuItem>}
                {(cat && cat.collapsed) &&
                <MenuItem className="inv-b-cats-cat-checkout">
                    <input
                        type="number" 
                        onClick={e => e.stopPropagation()}
                        value={checkoutAmount}
                        onChange={CheckCheckoutCount}
                    />
                </MenuItem>}
            </ContextMenu>
            <div className={`inv-b-cats-cat-item-list ${!showList ? "hidden" : ""}`}>
                    {(cat && !cat.collapsed) && item.shelf.map((subItem, index1) => {
                        return (
                            <InventoryCategorySubItem 
                                key={index1} 
                                location={location}
                                category={category}
                                item={subItem}
                                itemName={item.name}
                                parseField={parseHeaderFields}
                                checkout={checkout}
                            />
                        )
                    })}
                </div>
        </div>
    )
}