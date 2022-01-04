import axios from "axios";
import React, { useRef, useState } from "react";

import Button from "../../utility/button";
import Modal from "../../utility/modal";
import InventoryCategoryList from "./inventory_category_list";

export default function InventoryCategory({ location, category, checkout }) {
    const [addItemModal, setAddItemModal] = useState(false);
    const [viewCategory, setViewCategory] = useState(false);
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

    return (
        <div className="inventory-category">
            <div className="inventory-category-header" onClick={_ => setViewCategory(!viewCategory)}>
                <p>{category.name.toUpperCase()}</p>
                <p>{getHeaderCount()}</p>
                <Button onClick={ToggleItemModal} borderless>
                    Add Item
                </Button>
            </div>
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