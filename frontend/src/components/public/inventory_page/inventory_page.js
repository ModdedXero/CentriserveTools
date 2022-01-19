import React, { useState } from "react";

import Input from "../../utility/input";
import { Variable, APIs } from "../../utility/variable";
import InventoryAddItem from "./inventory_add_item";
import InventoryCategory from "./inventory_category";

const locationsVar = new Variable(APIs.Inventory, true);
const locationCats = new Variable(APIs.Inventory + "/inventory/categories", true);

export default function InventoryPage() {
    const [currentLoc, setCurrentLoc] = useState();
    

    const locations = locationsVar.useVar("locations", []);
    const categories = locationCats.useVar(currentLoc, []);

    function OnLocChange(item) {
        setCurrentLoc(item);
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
                                <InventoryCategory key={index} category={cat} location={currentLoc} />
                            )
                        })}
                    </div>
                    <div className="inv-b-checkout">

                    </div>
                </div>
            </div>
        </div>
    )
}