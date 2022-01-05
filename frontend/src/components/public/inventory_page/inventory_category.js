import axios from "axios";
import React, { useRef, useState } from "react";
import { ContextMenu, ContextMenuTrigger, MenuItem } from "react-contextmenu";

import Button from "../../utility/button";
import Modal from "../../utility/modal";
import InventoryCategoryList from "./inventory_category_list";

export default function InventoryCategory({ location, category, checkout }) {
    const [addItemModal, setAddItemModal] = useState(false);
    const [viewCategory, setViewCategory] = useState(false);
    const [viewNotesModal, setViewNotesModal] = useState(false);

    const [serialNumber, setSerialNumber] = useState(false);

    const itemNameRef = useRef("");
    const itemPriceRef = useRef(0);
    const itemAmountRef = useRef(0);
    const serialNumberRef = useRef("");

    function SubmitItem(e) {
        e.preventDefault();

        console.log(itemAmountRef.current)

        const item = {
            name: itemNameRef.current.value,
            price: itemPriceRef.current.value,
            serial: serialNumberRef.current ?  serialNumberRef.current.value : "",
            amount: itemAmountRef.current ? itemAmountRef.current.value : 1
        }

        axios.post("/api/inventory/item/add", {
            location: location,
            category: category.name,
            item: item
        })
        .then(res => window.location.reload())
    }

    function ToggleItemModal(e) {
        e.stopPropagation();

        setAddItemModal(true);
    }

    function getHeaderCount() {
        let count = 0;
        for (const item of category.items) {
            count += parseInt(item.amount) || 1;
        }

        return count;
    }

    function ToggleNotes() {
        if (category.notes.length) setViewNotesModal(true);
    }

    return (
        <div className="inventory-category">
            <ContextMenuTrigger id={category.name}>
                <div className="inventory-category-header" onClick={_ => setViewCategory(!viewCategory)}>
                    <p>{category.name.toUpperCase()}</p>
                    <p>{getHeaderCount()}</p>
                    <Button onClick={ToggleItemModal} borderless>
                        Add Item
                    </Button>
                </div>
            </ContextMenuTrigger>
            <ContextMenu id={category.name}>
                <MenuItem onClick={ToggleNotes}>
                    View Notes
                </MenuItem>
            </ContextMenu>
            <Modal visible={viewNotesModal} onClose={_ => setViewNotesModal(false)}>
                <h3>{location.toUpperCase()}</h3>
                <div className="category-notes">
                    {category.notes.map((note, index) => {
                        return (
                            <div key={index}>
                                <div>
                                    <label>User:</label>
                                    <p>{note.username}</p>
                                </div>
                                <div className="category-reason">
                                    <label>Reason:</label>
                                    <textarea value={note.reason} readOnly />
                                </div>
                                <div className="category-items">
                                    <label>Items:</label>
                                    <div>
                                        {note.itemData.map((data, ind1) => {
                                            return(
                                                <div className="checkout-list-category" key={ind1}>
                                                    <h2>{data.category.toUpperCase()}</h2>
                                                    <div>
                                                        <div className="checkout-list-item header">
                                                            <p>Item Name</p>
                                                            <p>Price</p>
                                                            <p>Serial / Amount</p>
                                                        </div>
                                                        {data.items.map((item, ind2) => {
                                                            return (
                                                                <div className="checkout-list-item" key={ind2}>
                                                                    <p>{item.name}</p>
                                                                    <p>$ {item.price}</p>
                                                                    {!item.serial && <p>{item.amount}</p>}
                                                                    {item.serial && <p>{item.serial}</p>}
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </Modal>
            <div className={`inventory-items ${viewCategory && "selected"}`}>
                <InventoryCategoryList 
                    location={location} 
                    category={category}
                    items={category.items}
                    checkout={checkout}
                />
            </div>
            <Modal visible={addItemModal} onClose={_ => setAddItemModal(false)}>
                <form className="form" onSubmit={SubmitItem}>
                    <div className="checkbox">
                        <input type="checkbox" onChange={e => setSerialNumber(e.target.checked)} />
                        <label>Serial Number?</label>
                    </div>
                    <div>
                        <label>Item Name</label>
                        <input ref={itemNameRef} type="text" required />
                    </div>
                    <div>
                        <label>Price</label>
                        <input ref={itemPriceRef} type="number" step={.01} defaultValue={0} required />
                    </div>
                    {!serialNumber && <div>
                        <label>Amount</label>
                        <input ref={itemAmountRef} type="number" step={1} defaultValue={1} required />
                    </div>}
                    {serialNumber && <div>
                        <label>Serial Number</label>
                        <input ref={serialNumberRef} defaultValue={""} type="text" />
                    </div>}
                    <Button type="submit">Add Item</Button>
                </form>
            </Modal>
        </div>
    )
}