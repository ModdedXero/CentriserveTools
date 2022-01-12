import React, { useState } from "react";

import Button from "../../../utility/button";
import Input from "../../../utility/input";
import Modal from "../../../utility/modal";
import { Variable, APIs } from "../../../utility/variable";

const catsVar = new Variable(APIs.Inventory + "/categories", true);

export default function InventoryAdminBody({ location }) {
    const [createCatModal, setCreateCatModal] = useState();

    const categories = catsVar.useVar(location, []);

    function CreateCategory(e) {
        e.preventDefault();

        catsVar.syncVar();
    }

    return (
        <div className="inv-admin-b">
            <div className="inv-admin-cat">
                <div className="inv-admin-cat-h">
                    <p>Categories</p> 
                </div>
                <div className="inv-admin-cat-b">
                    <div className="inv-admin-cat-b-list">
                        {categories.map((item, index) => {
                            return (
                                <div 
                                    className="inv-admin-cat-b-list-item" 
                                    key={index}
                                >
                                    {item}
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
                        <Button>Delete</Button>
                    </div>
                </div>
            </div>
            <div className="inv-admin-field">
                Fields
            </div>
            <div className="inv-admin-data">
                Field Data
                {categories.map((item, index) => {
                    return (
                        <div key={index}>
                            {item}
                        </div>
                    )
                })}
            </div>  
        </div>
    )
}