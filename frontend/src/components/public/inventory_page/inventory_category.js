import React from "react";

export default function InventoryCategory({ category }) {
    return (
        <div className="inventory-category">
            {category.name}
        </div>
    )
}