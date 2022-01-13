import React, { useEffect, useState } from "react";

import Button from "../../../utility/button";
import Input from "../../../utility/input";
import Modal from "../../../utility/modal";
import { Variable, APIs } from "../../../utility/variable";

const catsVar = new Variable(APIs.Inventory + "/categories", true);
const fieldsVar = new Variable(APIs.Inventory + "/categories/fields", true);

export default function InventoryAdminBody({ location }) {
    const [createCatModal, setCreateCatModal] = useState();
    const [editCatModal, setEditCatModal] = useState();

    const [selectedCat, setSelectedCat] = useState("");
    const [selectedField, setSelectedField] = useState("");

    const categories = catsVar.useVar(location, []);
    const fields = fieldsVar.useVar(selectedCat, []);

    useEffect(() => {

    });

    function CreateCategory(e) {
        e.preventDefault();

        catsVar.syncVar();

        setCreateCatModal(false);
    }

    function EditCategory(e) {
        e.preventDefault();

        const sCatCopy = {...selectedCat};
        sCatCopy.name = catsVar.upVar;

        catsVar.updateVar(sCatCopy, selectedCat);
        catsVar.syncVar();

        setEditCatModal();
    }

    function DeleteCategory() {
        catsVar.removeVar(selectedCat.name);
        catsVar.syncVar();
    }

    function CreateField(e) {

    }

    function EditField(e) {

    }

    function DeleteField() {
        
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
                                    onClick={_ => setSelectedCat(cat)}
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
                                    defaultValue={selectedCat.name}
                                    onChange={e => catsVar.updateVar(e.target.value)}
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
                                        field.name === (selectedField.name) ? "selected" : ""
                                    }`} 
                                    key={index}
                                    onClick={_ => setSelectedField(field)}
                                >
                                    {field.name}
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
                                    defaultValue={selectedCat.name}
                                    onChange={e => catsVar.updateVar(e.target.value)}
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
            <div className="inv-admin-data">
                Field Data
            </div>  
        </div>
    )
}