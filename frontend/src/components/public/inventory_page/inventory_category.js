import React from "react";
import Input from "../../utility/input";
import InventoryCategoryItem from "./inventory_category_item";

export default function InventoryCategory({ category }) {
    return (
        <div className="inv-b-cats-cat">
            <div className="inv-b-cats-cat-h">
                <h3>{category.name}</h3>
                <div className="inv-b-cats-cat-h-btn">
                    <Input
                        display="button"
                        label="Order" 
                    />
                    <Input
                        display="button"
                        label="History" 
                    />
                </div>
            </div>
            <div className="inv-b-cats-cat-b">
                {category.items.map((item, index) => {
                    return (
                        <InventoryCategoryItem 
                            item={item} 
                            category={category} 
                            key={index} 
                        />
                    )
                })}
            </div>
        </div>
    )
}