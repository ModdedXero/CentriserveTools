import React, { useRef, useState } from "react";

import SearchBar from "../../../utility/search_bar";
import Button from "../../../utility/button";
import Input from "../../../utility/input";
import Modal from "../../../utility/modal";
import { Variable, APIs } from "../../../utility/variable";

import "../../../../styles/inventory_page.css";
import InventoryAdminBody from "./inventory_admin_body";

const locationsVar = new Variable(APIs.Inventory, true);

export default function InventoryAdmin() {
    const [currentLocation, setCurrentLocation] = useState();

    const [createLocModal, setCreateLocModal] = useState(false);
    const [editLocModal, setEditLocModal] = useState(false);
    const [removeLocModal, setRemoveLocModal] = useState(false);

    const createLocNameRef = useRef();
    const editLocNameRef = useRef();
    const removeLocNameRef = useRef();

    const locations = locationsVar.useVar("locations", []);

    function CreateLocation(e) {
        e.preventDefault();

        locationsVar.createVar(createLocNameRef.current.value);
        locationsVar.syncVar();

        setCreateLocModal(false);
    }

    function onCreateLocChange(item) {
        setCurrentLocation(item.value);
    }

    function EditLocation(e) {
        e.preventDefault();

        locationsVar.updateVar(editLocNameRef.current.value, currentLocation);
        locationsVar.syncVar();

        setEditLocModal(false);
    }

    function RemoveLocation(e) {
        e.preventDefault();

        locationsVar.removeVar(removeLocNameRef.current);
        locationsVar.syncVar();

        setRemoveLocModal(false);
    }

    function onRemoveLocChange(item) {
        removeLocNameRef.current = item.value;
    }

    return (
        <div className="app-body">
            <div className="inv-admin">
                <div className="inv-admin-h">
                    <SearchBar
                        select
                        options={locations}
                        setValue={onCreateLocChange}
                    />
                    <Button onClick={_ => setCreateLocModal(true)}>
                        Add Location
                    </Button>
                    <Modal visible={createLocModal} onClose={setCreateLocModal}>
                        <form className="modal-form" onSubmit={CreateLocation}>
                            <Input 
                                label="Location Name"
                                refVal={createLocNameRef}
                                required
                            />
                            <Button type="submit">Create</Button>
                        </form>
                    </Modal>
                    <Button onClick={_ => setEditLocModal(true)}>
                        Edit Location
                    </Button>
                    <Modal visible={editLocModal} onClose={setEditLocModal}>
                        <form className="modal-form" onSubmit={EditLocation}>
                            <Input
                                defaultValue={currentLocation}
                                label="Location Name"
                                refVal={editLocNameRef}
                                required
                            />
                            <Button type="submit">Edit</Button>
                        </form>
                    </Modal>
                    <Button onClick={_ => setRemoveLocModal(true)}>
                        Remove Location
                    </Button>
                    <Modal visible={removeLocModal} onClose={setRemoveLocModal}>
                        <form className="modal-form" onSubmit={RemoveLocation}>
                            <SearchBar
                                select
                                options={locations}
                                setValue={onRemoveLocChange}
                            />
                            <Button type="submit">Remove</Button>
                        </form>
                    </Modal>
                </div>
                <InventoryAdminBody location={currentLocation} />
            </div>
        </div>
    )
}