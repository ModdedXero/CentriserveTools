import React, { useEffect, useState } from "react";

import Button from "../../../utility/button";
import Input from "../../../utility/input";
import Modal from "../../../utility/modal";
import { Variable, APIs } from "../../../utility/variable";
import InventoryAdminCat from "./inventory_admin_cat";

import InventoryAdminCatField from "./inventory_admin_cat_field";

const catsVar = new Variable(APIs.Inventory, true);
const fieldsVar = new Variable(APIs.Inventory + `/fields`, true);

export default function InventoryAdminBody({ location }) {
    const [createCatModal, setCreateCatModal] = useState(false);

    const [createFieldModal, setCreateFieldModal] = useState(false);

    const [selectedCat, setSelectedCat] = useState("");
    const [selectedField, setSelectedField] = useState("");

    const categories = catsVar.useVar("categories", []);
    const fields = fieldsVar.useVar(selectedCat.name, []);

    useEffect(() => {
        setSelectedCat("");
        setSelectedField("");
    }, [location]);

    function CreateCategory(e) {
        e.preventDefault();

        catsVar.syncVar();

        setCreateCatModal(false);
    }

    function DeleteCategory() {
        catsVar.removeVar(selectedCat.name);
        catsVar.syncVar();
    }

    function CreateField(e) {
        e.preventDefault();

        fieldsVar.syncVar();

        setCreateFieldModal(false);
    }

    function DeleteField() {
        fieldsVar.removeVar(selectedField.label);
        fieldsVar.syncVar();
    }

    function ChangeCat(cat) {
        setSelectedCat(cat);
        setSelectedField("");
    }

    return (
        <div className="inv-admin-b">
            <div className="inv-admin-cat">
                <div className="inv-admin-cat-h">
                    <p>Categories</p> 
                </div>
                <div className="inv-admin-cat-b">
                    <div className="inv-admin-cat-b-list">
                        {categories.map((cat, index) => {
                            return (
                                <div 
                                    className={`inv-admin-cat-b-list-item ${
                                        cat.name === (selectedCat.name) ? "selected" : ""
                                    }`} 
                                    key={index}
                                    onClick={_ => ChangeCat(cat)}
                                >
                                    {cat.name}
                                </div>
                            )
                        })}
                    </div>
                    <div className="inv-admin-cat-b-btn">
                        <Button onClick={_ => setCreateCatModal(true)}>
                            Create
                        </Button>
                        <Modal visible={createCatModal} onClose={setCreateCatModal}>
                            <form className="modal-form" onSubmit={CreateCategory}>
                                <Input
                                    label="Category Name"
                                    onChange={e => catsVar.createVar(e.target.value)}
                                    required
                                />
                                <Button type="submit">Create</Button>
                            </form>
                        </Modal>
                        <Button onClick={DeleteCategory}>
                            Delete
                        </Button>
                    </div>
                </div>
            </div>
            <div className="inv-admin-cat">
                <div className="inv-admin-cat-h">
                    <p>Fields</p> 
                </div>
                <div className="inv-admin-cat-b">
                    <div className="inv-admin-cat-b-list">
                        {fields.map((field, index) => {
                            return (
                                <div 
                                    className={`inv-admin-cat-b-list-item ${
                                        field.label === (selectedField.label) ? "selected" : ""
                                    }`} 
                                    key={index}
                                    onClick={_ => setSelectedField(field)}
                                >
                                    {field.label}
                                </div>
                            )
                        })}
                    </div>
                    <div className="inv-admin-cat-b-btn">
                        <Button onClick={_ => setCreateFieldModal(true)}>
                            Create
                        </Button>
                        <Modal visible={createFieldModal} onClose={setCreateFieldModal}>
                            <form className="modal-form" onSubmit={CreateField}>
                                <Input
                                    label="Field Name"
                                    onChange={e => fieldsVar.createVar(e.target.value)}
                                    required
                                />
                                <Button type="submit">Create</Button>
                            </form>
                        </Modal>
                        <Button onClick={DeleteField}>
                            Delete
                        </Button>
                    </div>
                </div>
            </div>
            {selectedField &&
            <InventoryAdminCatField 
                category={selectedCat}
                field={selectedField} 
                fieldVar={fieldsVar} 
            />}
            {selectedCat && !selectedField &&
            <InventoryAdminCat
                category={selectedCat}
                catVar={catsVar}
                setCat={setSelectedCat}
            />
            }
        </div>
    )
}