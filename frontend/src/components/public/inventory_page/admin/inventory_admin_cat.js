import React, { useEffect, useRef, useState } from "react";

import Input from "../../../utility/input";
import Notify from "../../../utility/notify";
import { Variable } from "../../../utility/variable";

export default function InventoryAdminCat({ category, catVar=new Variable(), setCat }) {
    const catNameRef = useRef(category.name);
    const catCollapsedRef = useRef(category.collapsed);

    const [updateNotify, setUpdateNotify] = useState(false);
    const [updateData, setUpdateData] = useState("");

    useEffect(() => {

    }, [category])

    function UpdateCategory() {
        const catCopy = {...category};

        catCopy.name = catNameRef.current.value;
        catCopy.collapsed = catCollapsedRef.current.checked;

        catVar.updateVar(catCopy, category);
        catVar.syncVar();

        setUpdateData(catCopy);
        setUpdateNotify(true);
        setCat(catCopy);
    }

    return (
        <div className="inv-admin-data">
            {updateNotify && <Notify value={updateData}>
                Updated!
            </Notify>}
            <div className="inv-admin-data-h">
                <p>Category Data</p>
                <Input
                    display="button"
                    label="Update"
                    onClick={UpdateCategory}
                />
            </div>
            <div className="inv-admin-data-b">
                {category && <div>
                    <Input
                        key={category.name}
                        label="Name"
                        defaultValue={category.name || ""}
                        refVal={catNameRef}
                    />
                    <Input 
                        key={category.collapsed + category.name}
                        label="Collapsed"
                        display="checkbox"
                        defaultValue={category.collapsed}
                        refVal={catCollapsedRef}
                    />
                </div>}
            </div>
        </div>
    )
}