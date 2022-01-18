import React from "react";

import { Variable, APIs } from "../../utility/variable";

const categoryVar = new Variable(APIs.Inventory + "/categories", false);

export default function InventoryCategoryItem({ item, category }) {
    const cat = categoryVar.useVar(category.name, null);

    function parseHeaderFields(field, index) {
        let content;

        if (field.showLabel) {
            content = `${field.label}: ${field.actionValue}`
        } else {
            content = field.actionValue;
        }

        if (field.header) {
            if (field.position === "Top Right") {
                return (
                    <div className="inv-b-cats-cat-item-topright" key={index}>
                        {content}
                    </div>
                )
            } else if (field.position === "Bottom Left") {
                return (
                    <div className="inv-b-cats-cat-item-botleft" key={index}>
                        {content}
                    </div>
                )
            } else if (field.position === "Bottom Right") {
                return (
                    <div className="inv-b-cats-cat-item-botright" key={index}>
                        {content}
                    </div>
                )
            }
        }
    }

    return (
        <div className="inv-b-cats-cat-item">
            <div className="inv-b-cats-cat-item-topleft">
                {item.name}
            </div>
            {cat && cat.fields.map((field, index) => {
                return parseHeaderFields(field, index);
            })}
        </div>
    )
}