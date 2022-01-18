import React from "react";

import { Variable, APIs } from "../../utility/variable";

const categoryVar = new Variable(APIs.Inventory + "/categories", false);

export default function InventoryCategoryItem({ item, category }) {
    const cat = categoryVar.useVar(category.name, null);

    function parseHeaderFields(field, index) {
        let content;

        if (field.actionValue) {
            if (field.showLabel) {
                content = `${field.label}: ${field.actionValue}`
            } else {
                content = field.actionValue;
            }
        } else {
            if (field.type === "Checkbox") {
                if (field.value === "true") field.value = "Yes"
                if (field.value === "false") field.value = "No"
            }

            if (field.showLabel) {
                content = `${field.label}: ${field.value}`
            } else {
                content = field.value;
            }
        }

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

    return (
        <div>
            <div className="inv-b-cats-cat-item">
                <div className="inv-b-cats-cat-item-topleft">
                    {item.name}
                </div>
                {cat && cat.fields.map((field, index) => {
                    if (field.header) return parseHeaderFields(field, index);
                })}
            </div>
            <div className="inv-b-cats-cat-item-list">
                    {(cat && !cat.collapsed) && item.collection.map((subItem, index1) => {
                        return (
                            <div className="inv-b-cats-cat-item-list-item" key={index1}>
                                <div className="inv-b-cats-cat-item-topleft">
                                    {item.name}
                                </div>
                                {subItem.fields.map((subField, index2) => {
                                    return parseHeaderFields(subField, index2);
                                })}
                            </div>
                        )
                    })}
                </div>
        </div>
    )
}