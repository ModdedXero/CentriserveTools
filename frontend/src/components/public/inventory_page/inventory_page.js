import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

import InventoryCategory from "./inventory_category";
import Button from "../../utility/button";
import Modal from "../../utility/modal";
import Select from "../../utility/search_bar";
import InventoryCheckoutForm from "./inventory_checkout_form";

import "../../../styles/inventory_page.css";

export default function InventoryPage() {
    const [locations, setLocations] = useState([]);
    const [categories, setCategories] = useState([]);

    const [currentLocation, setCurrentLocation] = useState("create");

    const [locationModal, setLocationModal] = useState(false);
    const [categoryModal, setCategoryModal] = useState(false);
    const [checkoutModal, setCheckoutModal] = useState(false);

    const [checkoutData, setCheckoutData] = useState([]);
    const [checkoutCount, setCheckoutCount] = useState(0);

    const locationRef = useRef();
    const categoryRef = useRef();

    useEffect(() => {
        axios.get(`/api/inventory/locations`)
            .then(res => {
                let array = [];
                for (const loc of res.data.response) {
                    array.push({ value: loc, label: loc.toUpperCase() });
                }
                
                array.push({ value: "add", label: "Create" });
                setLocations(array);
            })
            .catch(err => {
                let array = [];
                array.push({ value: "add", label: "Create" });
                setLocations(array);
            })
    }, []);

    function CreateLocation(e) {
        e.preventDefault();

        axios.post("/api/inventory/location/create", { location: locationRef.current.value.toLowerCase() })
            .then(res => window.location.reload());
    }

    function LoadLocation(location) {
        axios.get(`/api/inventory/location/${location}`)
            .then(res => {
                setCategories(res.data.response.categories);
            })
    }

    function OnLocationChange(value) {
        setCurrentLocation(value);
        if (value.value === "add") {
            setLocationModal(true);
        } else {
            LoadLocation(value.value);
        }
    }

    function CreateCategory(e) {
        e.preventDefault();

        axios.post(`/api/inventory/category`, { 
            location: currentLocation.value, 
            category: categoryRef.current.value.toLowerCase() 
        }).then(LoadLocation(currentLocation.value));

        setCategoryModal(false);
    }

    function AddToCheckout(category, item) {
        const retList = [...checkoutData];

        if (!checkoutData.length) {
            let newCategory = {
                category: category,
                items: []
            }
            newCategory.items.push(item);

            retList.push(newCategory);
            setCheckoutCount(checkoutCount + item.amount);
        }

        for (let j = 0; j < checkoutData.length; j++) {
            if (!item.serial) {
                for (let k = 0; k < checkoutData[j].items.length; k++) {
                    if (retList[j].items[k].name === item.name) {
                        retList[j].items[k].amount  += item.amount;
                        setCheckoutCount(checkoutCount + item.amount);
                    }
                }
            }

            if (retList[j].category === category) {
                retList[j].items.push(item);
                setCheckoutCount(checkoutCount + item.amount)
            } else {
                let newCategory = {
                    category: category,
                    items: []
                }
                newCategory.items.push(item);

                retList.push(newCategory);
                setCheckoutCount(checkoutCount + item.amount);
            }
        }

        setCheckoutData(retList);
    }
    
    function ToggleCategoryModal() {
        if (currentLocation) setCategoryModal(true);
    }


    return (
        <div className="app-body">
            <div className="inventory-page">
                <div className="inventory-nav">
                    <div>
                        <Select 
                            options={locations} 
                            setValue={OnLocationChange} 
                            select 
                            noSort
                        />
                        <Modal visible={locationModal} onClose={_ => setLocationModal(false)}>
                            <form className="modal-form" onSubmit={CreateLocation}>
                                <label>Location Name</label>
                                <input ref={locationRef} />
                                <Button type="submit">Create</Button>
                            </form>
                        </Modal>
                    </div>
                    <Button borderless onClick={ToggleCategoryModal}>
                        Add Category
                    </Button>
                    <Modal visible={categoryModal} onClose={_ => setCategoryModal(false)}>
                        <form className="modal-form" onSubmit={CreateCategory}>
                            <label>Category Name</label>
                            <input ref={categoryRef} />
                            <Button type="submit">Create</Button>
                        </form>
                    </Modal>
                </div>
                <div className="inventory-data">
                    <Modal visible={checkoutModal} onClose={_ => setCheckoutModal(false)}>
                        <InventoryCheckoutForm
                            location={currentLocation.value}
                            checkoutData={checkoutData}
                        />
                    </Modal>
                    <div className="inventory-header">
                        <Button borderless onClick={_ => setCheckoutModal(true)}>
                            Checkout
                        </Button>
                        <p>{checkoutCount}</p>
                    </div>
                    <div className="inventory-list">
                        {categories.map((category, index) => {
                            return <InventoryCategory 
                                location={currentLocation.value} 
                                category={category} 
                                checkout={AddToCheckout}
                                key={index}
                            />
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}