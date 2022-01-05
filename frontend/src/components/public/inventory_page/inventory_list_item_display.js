import React, { useRef, useState } from "react";
import axios from "axios";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

import Modal from "../../utility/modal";
import Button from "../../utility/button";

export default function InventoryListItemDisplay({ location, category, checkout, index, item }) {
    const [editModal, setEditModal] = useState(false);

    const itemNameRef = useRef("");
    const itemPriceRef = useRef(0);
    const itemSerialRef = useRef("");

    function SubmitItem(e) {
        e.preventDefault();

        const newItem = {
            name: itemNameRef.current.value,
            price: itemPriceRef.current.value,
            serial: itemSerialRef.current ? itemSerialRef.current.value : "",
            _id: item._id
        }

        axios.post("/api/inventory/item/update", {
            location: location,
            category: category.name,
            item: newItem
        })
        .then(res => window.location.reload())
    }

    function AddToCheckout() {
        checkout(item);
    }

    return (
        <div onClick={e => { e.stopPropagation(); }}>
            <ContextMenuTrigger id={`item-menu ${item.serial} ${index}`}>
                <div className="inventory-item-display-info">
                    <p>{item.name}</p>
                    <p>{item.serial}</p>
                </div>
            </ContextMenuTrigger>
            <ContextMenu id={`item-menu ${item.serial} ${index}`}>
                <MenuItem onClick={_ => setEditModal(true)}>
                    Edit Item
                </MenuItem>
                <MenuItem onClick={AddToCheckout}>
                    Checkout Item
                </MenuItem>
            </ContextMenu>
            <Modal visible={editModal} onClose={setEditModal}>
                <form className="form" onSubmit={SubmitItem}>
                    <div>
                        <label>Item Name</label>
                        <input 
                            ref={itemNameRef} 
                            type="text" 
                            defaultValue={item.name} 
                            required 
                        />
                    </div>
                    <div>
                        <label>Price</label>
                        <input 
                            ref={itemPriceRef} 
                            type="number" step={.01} 
                            defaultValue={item.price} 
                            required 
                        />
                    </div>
                    <div>
                        <label>Serial Number</label>
                        <input 
                            ref={itemSerialRef} 
                            type="text" 
                            defaultValue={item.serial} 
                            required
                        />
                    </div>
                    <Button type="submit">Add Item</Button>
                </form>
            </Modal>
        </div>
    )
}