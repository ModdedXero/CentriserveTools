import axios from "axios";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import Button from "../../utility/button";
import InventoryItem from "./inventory_item";

const officeOptions = [
    {
        value: "utah",
        label: "Utah"
    },
    {
        value: "texas",
        label: "Texas"
    },
    {
        value: "arizona",
        label: "Arizona"
    }
]

export default function InventoryPage() {
    const [currentLocation, setCurrentLocation] = useState("utah");
    const [inventoryItems, setInventoryItems] = useState([]);
    
    useEffect(() => {
        axios.get("/api/inventory/test")
            .then(res => {
                console.log(res.data.response)
                setInventoryItems(res.data.response);
            })
    }, []);

    function DuplicateDiv(div) {
        const array = [];
        for (let i = 0; i < 10; i++) {
            array.push(div);
        }

        return array.map(val => {
            return val;
        })
    }

    function UpdateCheckout(counts) {
        console.log(counts)
    }

    return (
        <div className="app-body">
            <div className="inventory-page">
                <div className="inventory-header">
                    <Select
                        className="react-select select-fit"
                        options={officeOptions}
                        defaultValue={{ value: "utah", label: "Utah" }}
                    />
                    <Button>Checkout</Button>
                </div>
                <div className="inventory-items">
                    {inventoryItems.map((item, index) => {
                        return DuplicateDiv(
                            <InventoryItem item={item} key={index} updateCheckout={UpdateCheckout} />
                    )
                    })}
                </div>
            </div>
        </div>
    )
}