import React, { useEffect, useState } from "react";

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

    useEffect(() => {
        setCheckoutList([]);
    }, [currentLoc])

    function AddToCheckout(category, sItem) {
        // Add Item to Checkout
        let handled = false;

        const item = JSON.parse(JSON.stringify(sItem));

        item.item.name = item.name;
        for (let j = 0; j < item.item.fields.length; j++) {
            if (item.item.fields[j].action === "Amount") {
                item.item.fields[j].value = item.amount;
            }
        }

        const sortedList = [...checkoutList];
        for (let i = 0; i < sortedList.length; i++) {
            if (sortedList[i].category === category.name) {
                if (category.collapsed) {
                    for (let j = 0; j < sortedList[i].items.length; j++) {
                        if (sortedList[i].items[j].name === item.name) {
                            for (let k = 0; k < sortedList[i].items[j].fields.length; k++) {
                                if (sortedList[i].items[j].fields[k].action === "Amount") {
                                    sortedList[i].items[j].fields[k].value += item.amount;
                                }
                            }
                        }
                    }
                } else {
                    sortedList[i].items.push(item.item);
                }

                handled = true;
            }
        }
    
        if (!handled) sortedList.push({ category: category.name, items: [item.item] })
        setCheckoutList(sortedList);

        // Remove Item from Category
        for(let i = 0; i < categories.length; i++) {
            if (categories[i].name === category.name) {
                for (let j = 0; j < categories[i].items.length; j++) {
                    if (categories[i].items[j].name === item.name) {
                        for (let k = 0; k < categories[i].items[j].shelf.length; k++) {
                            if (!categories[i].collapsed) {
                                if (categories[i].items[j].shelf[k]._id === item.item._id) {
                                    categories[i].items[j].shelf.splice(k, 1);
                                }
                            } else {
                                if (categories[i].items[j].shelf[k]._id === item.item._id) {
                                    categories[i].items[j].amount -= item.amount;
                                    for (let l = 0; l < categories[i].items[j].shelf[k].fields.length; l++) {
                                        if (categories[i].items[j].shelf[k].fields[l].action === "Amount") {
                                            categories[i].items[j].shelf[k].fields[l].value = categories[i].items[j].amount;
                                        }
                                    }
                                }
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