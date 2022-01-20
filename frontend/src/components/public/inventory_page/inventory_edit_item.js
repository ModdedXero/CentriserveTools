import React, { useEffect, useState, useRef } from "react";

import Input from "../../utility/input";
import Modal from "../../utility/modal";
import { Variable, APIs } from "../../utility/variable";

const invFieldsVar = new Variable(APIs.Inventory + "/inventory/fields", false);

export default function InventoryEditItem({ location, category, item, itemName, modal, setModal }) {
    const newItemRef = useRef([]);

    function getType(type) {
        if (type === "Text") {
            return null;
        } else if (type === "List") {
            return "dropdown"
        } else if (type === "Number") {
            return "number";            
        } else if (type === "Checkbox") {
            return "checkbox"
        }

        return null;
    }

    function SubmitItem(e) {
        e.preventDefault();

        const newItem = {};
        const newItemRefParse = [];

        newItem.fields = [];
        newItem.name = itemName;
        item.name = itemName;

        for (let i = 0; i < newItemRef.current.length; i++) {
            if (newItemRef.current[i]) newItemRefParse.push(newItemRef.current[i]);
        }

        let i = 0;
        for (const field of item.fields) {
            const itemCopy = {...field};
            if (field.action === "Amount") {
                newItem.amount = parseInt(newItemRefParse[i].value);
            }
            
            if (field.type === "Checkbox") {
                itemCopy.value = newItemRefParse[i].checked;
            } else {
                itemCopy.value = newItemRefParse[i].value;
            }

            newItem.fields.push(itemCopy);
            i++;
        }

        invFieldsVar.setVariable(location);
        invFieldsVar.updateVar([newItem, item], category);
        invFieldsVar.syncVar();

        setModal(false);
    }

    return (
        <Modal visible={modal} onClose={_ => setModal(false)}>
            <form className="modal-form" onSubmit={SubmitItem}>
                <Input
                    label="Category"
                    defaultValue={category.name}
                    readOnly
                />
                <Input
                    label="Name"
                    defaultValue={itemName}
                    readOnly
                />
                {item && item.fields.map((field, index) => {
                    if (index === 0) {
                        newItemRef.current.length = 0;
                    }

                    return (
                        <Input
                            key={index}
                            label={field.label}
                            display={getType(field.type)}
                            defaultValue={field.value}
                            type={getType(field.type)}
                            refVal={el => newItemRef.current.push(el) }
                            required={field.type !== "Checkbox"}
                        />
                    )
                })}
                <Input
                    label="Edit Item"
                    display="button"
                    type="submit"
                />
            </form>
        </Modal>
    )
}