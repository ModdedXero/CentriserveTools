import React, { useEffect, useState } from "react";

import Button from "../../../utility/button";
import Input from "../../../utility/input";
import Modal from "../../../utility/modal";
import { Variable, APIs } from "../../../utility/variable";

import InventoryAdminCatField from "./inventory_admin_cat_field";

const catsVar = new Variable(APIs.Inventory + "/categories", true);
const fieldsVar = new Variable(APIs.Inventory + `/fields/`, true);

export default function InventoryAdminBody({ location }) {
    const [createCatModal, setCreateCatModal] = useState(false);
    const [editCatModal, setEditCatModal] = useState(false);

    const [createFieldModal, setCreateFieldModal] = useState(false);
    const [editFieldModal, setEditFieldModal] = useState(false);

    const [selectedCat, setSelectedCat] = useState("");
    const [selectedField, setSelectedField] = useState("");

    const categories = catsVar.useVar(location, []);

    fieldsVar.updateAPI(APIs.Inventory + `/fields/${location}`);
    const fields = fieldsVar.useVar(selectedCat, []);

    useEffect(() => {
        setSelectedField("");
        setSelectedCat("");
    }, [location]);

    function CreateCategory(e) {
        e.preventDefault();

        catsVar.syncVar();

        setCreateCatModal(false);
    }

    function EditCategory(e) {
        e.preventDefault();

        setSelectedCat(catsVar.upVar);
        catsVar.syncVar();

        setEditCatModal();
    }

    function DeleteCategory() {
        catsVar.removeVar(selectedCat);
        catsVar.syncVar();
    }

    function CreateField(e) {
        e.preventDefault();

        fieldsVar.syncVar();

        setCreateFieldModal(false);
    }

    function EditField(e) {
        e.preventDefault();

        const fieldCopy = {...selectedField};
        fieldCopy.label = fieldsVar.upVar;
        fieldsVar.updateVar(fieldCopy, selectedField);
        setSelectedField(fieldsVar.upVar);
        fieldsVar.syncVar();

        setEditFieldModal(false);
    }

    function DeleteField() {
        fieldsVar.removeVar(selectedField.label);
        fieldsVar.syncVar();
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
                                        cat.name === (selectedCat) ? "selected" : ""
                                    }`} 
                                    key={index}
                                    onClick={_ => setSelectedCat(cat.name)}
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
                        <Button onClick={_ => setEditCatModal(true)}>
                            Edit
                        </Button>
                        <Modal visible={editCatModal} onClose={setEditCatModal}>
                            <form className="modal-form" onSubmit={EditCategory}>
                                <Input
                                    label="Edit Category Name"
                                    defaultValue={selectedCat}
                                    onChange={e => catsVar.updateVar(e.target.value, selectedCat)}
                                    required
                                />
                                <Button type="submit">Edit</Button>
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
                        <Button onClick={_ => setEditFieldModal(true)}>
                            Edit
                        </Button>
                        <Modal visible={editFieldModal} onClose={setEditCatModal}>
                            <form className="modal-form" onSubmit={EditField}>
                                <Input
                                    label="Edit Field Name"
                                    defaultValue={selectedField.label}
                                    onChange={e => fieldsVar.updateVar(
                                        e.target.value, selectedField
                                    )}
                                    required
                                />
                                <Button type="submit">Edit</Button>
                            </form>
                        </Modal>
                        <Button onClick={DeleteField}>
                            Delete
                        </Button>
                    </div>
                </div>
            </div>
            <InventoryAdminCatField field={selectedField} fieldVar={fieldsVar} />
        </div>
    )
}