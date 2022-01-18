import React, { useEffect, useState, useRef } from "react";

import Input from "../../utility/input";
import Modal from "../../utility/modal";
import { Variable, APIs } from "../../utility/variable";

const categoriesVar = new Variable(APIs.Inventory, true);
const invFieldsVar = new Variable(APIs.Inventory + "/inventory/fields", false);

export default function InventoryAddItem({ location }) {
    const [addItemModal, setAddItemModal] = useState();
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [selectedCat, setSelectedCat] = useState();
    const [catRef, setCatRef] = useState();

    const categories = categoriesVar.useVar("categories", []);

    const newItemNameRef = useRef();
    const newItemRef = useRef([]);

    useEffect(() => {
        const catList = [];

        for (const cat of categories) {
            catList.push({
                value: cat.name,
                label: cat.name
            });
        }

        setCategoryOptions(catList);
    }, [categories])

    useEffect(() => {
        setCatRef(categories.filter(e => e.name === selectedCat)[0]);
    }, [selectedCat])

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
        newItem.fields = [];

        newItem.name = newItemNameRef.current;

        let i = 0;
        for (const field of catRef.fields) {
            if (field.item) {
                const itemCopy = {...field};
                if (field.action === "Amount") {
                    itemCopy.amount = newItemRef.current[i].value;
                }
                
                if (field.type === "Checkbox") {
                    itemCopy.value = newItemRef.current[i].checked;
                } else {
                    itemCopy.value = newItemRef.current[i].value || newItemRef.current[i].checked;
                }

                newItem.fields.push(itemCopy);
                i++;
            }
        }

        invFieldsVar.setVariable(location);
        invFieldsVar.updateVar(newItem, catRef);
        invFieldsVar.syncVar();

        setAddItemModal(false);
    }

    return (
        <div className="inv-add">
            <Input
                display="button"
                label="Add Item"
                onClick={_ => setAddItemModal(true)}
            />
            <Modal visible={addItemModal} onClose={_ => setAddItemModal(false)}>
                <form className="modal-form" onSubmit={SubmitItem}>
                    <Input
                        label="Category"
                        display="dropdown"
                        values={categoryOptions}
                        onChange={i => setSelectedCat(i)}
                    />
                    {catRef && 
                    <Input
                        label={catRef.nameField.label}
                        display={getType(catRef.nameField.type)}
                        values={catRef.nameField.valueList}
                        refVal={newItemNameRef}
                    />}
                    {catRef && catRef.fields.map((field, index) => {
                        if (field.item) {
                            return (
                                <Input
                                    key={index}
                                    label={field.label}
                                    display={getType(field.type)}
                                    type={getType(field.type)}
                                    refVal={el => newItemRef.current.push(el)}
                                    required={field.type !== "Checkbox"}
                                />
                            )
                        }
                    })}
                    <Input
                        label="Add Item"
                        display="button"
                        type="submit"
                    />
                </form>
            </Modal>
        </div>
    )
}