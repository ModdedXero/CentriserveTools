import axios from "axios";
import React, { useEffect, useState } from "react";
import Select from "react-select";

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

    return (
        <div className="app-body">
            <div className="inventory-page">
                <div className="inventory-header">
                    <Select>

                    </Select>
                </div>
                <div className="inventory-items">

                </div>
            </div>
        </div>
    )
}