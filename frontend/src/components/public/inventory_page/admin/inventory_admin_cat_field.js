import React, { useEffect, useRef, useState } from "react";

import Input from "../../../utility/input";
import Notify from "../../../utility/notify";
import { Variable } from "../../../utility/variable";

export default function InventoryAdminCatField({ field, fieldVar=new Variable() }) {
    const labelRef = useRef();
    const [typeRef, setTypeRef] = useState();
    const [actionRef, setActionRef] = useState();
    const positionRef = useRef();
    const transitRef = useRef();
    const headerRef = useRef();
    const addItemRef = useRef();
    const showLabelRef = useRef();
    const valueListRef = useRef();
    const actionValueRef = useRef();

    const [errorNotify, setErrorNotify] = useState(false);
    const [errorData, setErrorData] = useState("");

    function UpdateField() {
        
    }

    return (
        <div className="inv-admin-data">
            {errorNotify && <Notify lifetime={2}>
                {errorData}
            </Notify>}
            <div className="inv-admin-data-h">
                <p>Field Data</p>
                <Input
                    display="button"
                    label="Update"
                    onClick={UpdateField}
                />
            </div>
            <div className="inv-admin-data-b">
                {field && 
                <div>
                    <Input
                        key={field.label}
                        label="Name"
                        refVal={labelRef}
                        defaultValue={field.label || ""}
                    />
                    <div className="inv-admin-data-row">
                        <Input
                            key={field.type}
                            label="Type"
                            display="dropdown"
                            onChange={i => setTypeRef(i)}
                            values={[
                                {
                                    value: "Text",
                                    label: "Text"
                                },
                                {
                                    value: "List",
                                    label: "List"
                                },
                                {
                                    value: "Number",
                                    label: "Number"
                                },
                                {
                                    value: "Checkbox",
                                    label: "Checkbox"
                                }
                            ]}
                            defaultValue={field.type ? {
                                value: field.type || "",
                                label: field.type || ""
                            } : ""}
                        />
                        {(field.type === "List" || typeRef === "List") &&
                        <Input 
                            display="list"
                            label="List"
                            refVal={valueListRef}
                        />}
                    </div>
                    <div className="inv-admin-data-row">
                        <Input
                            key={field.action}
                            label="Action"
                            display="dropdown"
                            values={[
                                {
                                    value: "None",
                                    label: "None"
                                },
                                {
                                    value: "Notify",
                                    label: "Notify",
                                    description: "Only for Type Number | Less than amount triggers Notify"
                                }
                            ]}
                            onChange={i => setActionRef(i)}
                            defaultValue={field.action ? {
                                value: field.action,
                                label: field.action
                            } : { value: "None", label: "None" }}
                        />
                        {(field.action === "Notify" || actionRef === "Notify") && 
                        <Input
                            label="Amount"
                            type="number"
                            refVal={actionValueRef}
                        />}
                    </div>
                    <Input
                        key={field.position}
                        label="Position"
                        display="dropdown"
                        values={[
                            {
                                value: "Top Left",
                                label: "Top Left"
                            },
                            {
                                value: "Top Right",
                                label: "Top Right"
                            },
                            {
                                value: "Bottom Left",
                                label: "Bottom Left"
                            },
                            {
                                value: "Bottom Right",
                                label: "Bottom Right"
                            }
                        ]}
                        refVal={positionRef}
                        defaultValue={field.position ? {
                            value: field.position || "",
                            label: field.position || ""
                        } : ""}
                    />
                    <Input
                        key={field.transit}
                        label="Transit?"
                        display="checkbox"
                        refVal={transitRef}
                        defaultValue={field.transit}
                    />
                    <Input
                        key={field.header}
                        label="Show Header?"
                        display="checkbox"
                        refVal={headerRef}
                        defaultValue={field.header}
                    />
                    <Input
                        key={field.addItem}
                        label="Add Item?"
                        display="checkbox"
                        refVal={addItemRef}
                        defaultValue={field.addItem}
                    />
                    <Input
                        key={field.showLabel}
                        label="Show Label?"
                        display="checkbox"
                        refVal={showLabelRef}
                        defaultValue={field.showLabel}
                    />
                </div>}
            </div>
        </div>
    )
}