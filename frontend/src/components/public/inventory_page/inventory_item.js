import React, { useState } from "react";
import "../../../styles/inventory_page.css";

import Button from "../../utility/button";
import Modal from "../../utility/modal";
import InventoryListItem from "./inventory_list_item";

export default function InventoryItem({ item, updateCheckout }) {
    const [isModal, setIsModal] = useState(false);
    const [itemCounts, setItemCounts] = useState({});

    function UpdateItemCount(index, count) {
        itemCounts[index] = count;
    }

    function AddToCheckout() {
        updateCheckout({ type: item.title, items: itemCounts });
        CloseModal();
    }

    function CloseModal() {
        setIsModal(false);
        setItemCounts({});
    }

    return (
        <div className="inventory-item">
            <h1>{item.title} ({item.items.length})</h1>
            <div className="inventory-item-buttons">
                <Button>Notes</Button>
                <Button>Add Item</Button>
                <Button onClick={_ => setIsModal(!isModal)}>Info</Button>
            </div>
            <Modal 
                visible={isModal}
                onClose={CloseModal}
            >
                <div className="inventory-item-list">
                    {item.items.map((val, index) => {
                        return (
                            <InventoryListItem item={val} index={index} updateCount={UpdateItemCount} />
                        )
                    })}
                </div>
                <Button onClick={AddToCheckout}>Add to Checkout</Button>
            </Modal>
        </div>
    )
}