import React, { useState } from "react";

import Input from "../../utility/input";
import { Variable, APIs } from "../../utility/variable";
import InventoryAddItem from "./inventory_add_item";
import InventoryCategory from "./inventory_category";
import InventoryCheckout from "./inventory_checkout";

const locationsVar = new Variable(APIs.Inventory, true);
const locationCats = new Variable(APIs.Inventory + "/inventory/categories", true);

export default function InventoryPage() {
    const [currentLoc, setCurrentLoc] = useState();
    const [checkoutList, setCheckoutList] = useState([]);
    
    const locations = locationsVar.useVar("locations", []);
    const categories = locationCats.useVar(currentLoc, []);

    function OnLocChange(item) {
        setCurrentLoc(item);
    }

    function AddToCheckout(category, item, itemName) {
        // Add Item to Checkout
        let handled = false;
    
        item.name = itemName;
        for (const field of item.fields) {
            if (field.action === "Amount") {
                item.amount = field.value;
            }
        }
        if (!item.amount) item.amount = 1;

        const sortedList = [...checkoutList];
        for (let i = 0; i < sortedList.length; i++) {
            if (sortedList[i].category === category) {
                sortedList[i].items.push(item);
                handled = true;
            }
        }
    
        if (!handled) sortedList.push({ category: category, items: [item] })
        setCheckoutList(sortedList);

        // Remove Item from Category
        for(let i = 0; i < categories.length; i++) {
            if (categories[i].name === category) {
                for (let j = 0; j < categories[i].items.length; j++) {
                    if (categories[i].items[j].name === itemName) {
                        for (let k = 0; k < categories[i].items[j].shelf.length; k++) {
                            if (categories[i].items[j].shelf[k]._id === item._id) {
                                categories[i].items[j].shelf.splice(k, 1);
                            }
                        }
                    }
                }
            }
        }
    }

    return (
        <div className="app-body">
            <div className="inv">
                <div className="inv-h">
                    <Input 
                        display="dropdown"
                        values={locations}
                        onChange={OnLocChange}
                    />
                    <InventoryAddItem location={currentLoc} />
                </div>
                <div className="inv-b">
                    <div className="inv-b-cats">
                        {categories.map((cat, index) => {
                            return (
                                <InventoryCategory 
                                    key={index} 
                                    category={cat} 
                                    location={currentLoc}
                                    checkout={AddToCheckout}
                                />
                            )
                        })}
                    </div>
                    <InventoryCheckout 
                        location={currentLoc}
                        categories={categories}
                        checkoutList={checkoutList} 
                        setList={setCheckoutList}
                    />
                </div>
            </div>
        </div>
    )
}