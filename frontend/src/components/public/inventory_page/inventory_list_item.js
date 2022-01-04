import React, { useRef, useState } from "react";
import axios from "axios";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

import InventoryListItemDisplay from "./inventory_list_item_display";
import Modal from "../../utility/modal";
import Button from "../../utility/button";

export default function InventoryListItem({ location, category, checkout, group, id }) {
    const [showItems, setShowItems] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [checkoutCount, setCheckoutCount] = useState(0);

    const itemNameRef = useRef("");
    const itemPriceRef = useRef(0);
    const itemAmountRef = useRef("");

    function ToggleItems(e) {
        if (e) e.stopPropagation();
        if (group.serial && group.amount > 0) {
            setShowItems(!showItems)
        } else {
            setShowItems(false);
        }
    }

    function SubmitItem(e) {
        e.preventDefault();

        const item = {
            name: itemNameRef.current.value,
            price: itemPriceRef.current.value,
            amount: itemAmountRef.current ? itemAmountRef.current.value : 1
        }

        axios.post("/api/inventory/item/update", {
            location: location,
            category: category.name,
            item: item
        })
        .then(res => window.location.reload())
    }

    function AddToCheckout() {
        group.amount -= checkoutCount;
        
        checkout(category, { 
            name: group.name, 
            amount: checkoutCount,
            price: group.price
        });

        setCheckoutCount(0);
    }

    function AddSerialItemToCheckout(item) {
        group.amount -= 1;
        group.items = group.items.filter(i => i.serial === item.serial);

        checkout(category, {
            name: group.name,
            amount: 1,
            price: group.price,
            serial: item.serial
        });

        if (group.amount <= 0) setShowItems(false);
    }

    function SubCount(e) {
        e.stopPropagation();
        if (checkoutCount > 0) setCheckoutCount(checkoutCount - 1);
    }

    function AddCount(e) {
        e.stopPropagation();

        if (checkoutCount < group.amount) setCheckoutCount(checkoutCount + 1);
    }

    function SetCount(e) {
        e.stopPropagation();

        setCheckoutCount(e.target.value);
    }

    function CheckCount() {
        if (checkoutCount < group.amount && checkoutCount > 0) {
            setCheckoutCount(checkoutCount);
        } else if (checkoutCount < 0) {
            setCheckoutCount(0);
        } else {
            setCheckoutCount(group.amount);
        }
    }

    return (
        <div className="inventory-items-item" onClick={ToggleItems}>
            <ContextMenuTrigger id={`header-menu ${id} ${category.name}`}>
                <div className="inventory-item-header">
                    <p>{group.name}</p>
                    <p>$ {group.price}</p>
                    <p>{group.amount}</p>
                </div>
            </ContextMenuTrigger>
            <ContextMenu id={`header-menu ${id} ${category.name}`}>
                {!group.serial && <MenuItem onClick={_ => setEditModal(true)}>
                    Edit Item
                </MenuItem>}
                {!group.serial && <MenuItem onClick={AddToCheckout}>
                    Checkout Item
                </MenuItem>}
                {!group.serial && <MenuItem className="flex add-gap" onClick={e => e.stopPropagation()}>
                    <Button borderless onClick={SubCount}>-</Button>
                    <input 
                        onClick={e => e.stopPropagation()} 
                        step={1}
                        value={checkoutCount}
                        onInput={SetCount}
                        onBlur={CheckCount}
                    />
                    <Button borderless onClick={AddCount}>+</Button>
                </MenuItem>}
                {group.serial && <MenuItem>
                    Show Items
                </MenuItem>}
            </ContextMenu>
            <Modal visible={editModal} onClose={setEditModal}>
                <form className="form" onSubmit={SubmitItem}>
                    <div>
                        <label>Item Name</label>
                        <input 
                            ref={itemNameRef} 
                            type="text" 
                            defaultValue={group.name} 
                            required 
                        />
                    </div>
                    <div>
                        <label>Price</label>
                        <input 
                            ref={itemPriceRef} 
                            type="number" step={.01} 
                            defaultValue={group.price} 
                            required 
                        />
                    </div>
                    <div>
                        <label>Amount</label>
                        <input 
                            ref={itemAmountRef} 
                            type="number" 
                            step={1} 
                            defaultValue={group.amount} 
                            required
                        />
                    </div>
                    <Button type="submit">Add Item</Button>
                </form>
            </Modal>
            <div className={`inventory-item-display ${showItems ? "selected" : ""}`}>
                {group.items.map((item, index) => {
                    return (
                        <InventoryListItemDisplay
                            location={location}
                            category={category}
                            checkout={AddSerialItemToCheckout}
                            key={index} 
                            index={index} 
                            id={id} 
                            item={item} 
                        />
                    )
                })}
            </div>
        </div>
    )
}