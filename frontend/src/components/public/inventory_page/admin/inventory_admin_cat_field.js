import React, { useEffect, useRef, useState } from "react";

import Input from "../../../utility/input";
import Notify from "../../../utility/notify";
import { Variable } from "../../../utility/variable";

export default function InventoryAdminCatField({ field, fieldVar=new Variable() }) {
    const labelRef = useRef(field.label);
    const [typeRef, setTypeRef] = useState(field.type);
    const [actionRef, setActionRef] = useState("None");
    const positionRef = useRef();
    const transitRef = useRef();
    const [headerRef, setHeaderRef] = useState(field.header || false);
    const [itemRef, setItemRef] = useState(field.item || false);
    const showLabelRef = useRef();
    const valueListRef = useRef();
    const actionValueRef = useRef();

    const [updateNotify, setUpdateNotify] = useState(false);
    const [updateData, setUpdateData] = useState("");

    const [errorNotify, setErrorNotify] = useState(false);
    const [errorData, setErrorData] = useState("");

    useEffect(() => {
        setTypeRef(field.type || "");
        setActionRef(field.action || "None");
        setUpdateData("");
        setErrorData("");
        setErrorNotify(false);
        setUpdateNotify(false);
        setItemRef(field.item || false);
        setHeaderRef(field.header || false);
    }, [field])

    function UpdateField() {
        const fieldCopy = {...field};
        let err = "";

        if (field.label !== "Name") {
            fieldCopy.label = labelRef.current.value || field.label;
            fieldCopy.type = typeRef || field.type;
            fieldCopy.action = actionRef || field.action;
            fieldCopy.position = positionRef.current || field.position;
            fieldCopy.transit = transitRef.current ? transitRef.current.checked : field.transit;
            fieldCopy.header = headerRef;
            fieldCopy.item = itemRef;
            fieldCopy.showLabel = showLabelRef.current.checked;
            fieldCopy.valueList = valueListRef.current || field.valueList;
            if (actionValueRef.current)
                fieldCopy.actionValue = actionValueRef.current.value || field.actionValue;
            
            if (!fieldCopy.label)
                err = err + "Missing Data: Name\n";
            if (!fieldCopy.type)
                err = err + "Missing Data: Type\n";
            if (!fieldCopy.action)
                err = err + "Missing Data: Action\n";
            if (!fieldCopy.position)
                err = err + "Missing Data: Position\n";
            if (fieldCopy.type === "List" && fieldCopy.valueList.length <= 0)
                err = err + "Missing Data: List\n";
        } else {
            console.log(typeRef)
            fieldCopy.type = typeRef || field.type;
            fieldCopy.valueList = valueListRef.current || field.valueList;

            if (fieldCopy.type === "List" && fieldCopy.valueList.length <= 0)
                err = err + "Missing Data: List\n";
        }

        if (!err) {
            fieldVar.updateVar(fieldCopy, field);
            fieldVar.syncVar();
            setUpdateData(fieldCopy);
            setUpdateNotify(true);
        } else {
            setErrorData(err);
            setErrorNotify(true);
        }
    }

    return (
        <div className="inv-admin-data">
            {errorNotify && <Notify error>
                {errorData}
            </Notify>}
            {updateNotify && <Notify value={updateData}>
                Updated!
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
                    {field.label !== "Name" &&
                    <Input
                        key={field.header + "Header" + field.label}
                        label="Display in Header"
                        display="checkbox"
                        onChange={e => setHeaderRef(e.target.checked)}
                        defaultValue={field.header}
                    />}
                    {field.label !== "Name" &&
                    <Input
                        key={field.item + "Item" + field.label}
                        label="Display in Item"
                        display="checkbox"
                        onChange={e => setItemRef(e.target.checked)}
                        defaultValue={field.item}
                    />}
                    <Input
                        key={field.label}
                        label="Name"
                        refVal={labelRef}
                        readOnly={field.label === "name" ? true : false}
                        defaultValue={field.label || ""}
                    />
                    <div className="inv-admin-data-row">
                        <Input
                            key={field.type + field.label}
                            label="Type"
                            display="dropdown"
                            onChange={i => setTypeRef(i)}
                            values={field.label === "Name"
                            ? 
                            [
                                "Text",
                                "List"
                            ]
                            :
                            (headerRef ? 
                                [
                                    "Text",
                                    "List",
                                    "Number"
                                ]
                                :
                                [
                                    "Text",
                                    "List",
                                    "Number",
                                    "Checkbox"
                            ])}
                            defaultValue={field.type ? {
                                value: field.type || "",
                                label: field.type || ""
                            } : ""}
                        />
                        {(typeRef === "List") &&
                        <Input
                            key={"field-list" + field.label}
                            display="list"
                            label="List"
                            values={field.valueList}
                            refVal={valueListRef}
                        />}
                    </div>
                    {!itemRef &&
                    <div className="inv-admin-data-row">
                        <Input
                            key={field.action + field.label}
                            label="Action"
                            display="dropdown"
                            values={typeRef === "Number" ?
                            [
                                {
                                    value: "None",
                                    label: "None"
                                },
                                {
                                    value: "Notify",
                                    label: "Notify",
                                    description: "Less than amount triggers Notify"
                                },
                                {
                                    value: "Total",
                                    label: "Total",
                                    description: "Displays the total amount of items"
                                },
                                {
                                    value: "Sum",
                                    label: "Sum",
                                    description: "Displays sum of linked Item Field"
                                },
                                {
                                    value: "Amount",
                                    label: "Amount",
                                    description: "Allows for saving multiple items. Use in item for user to set amount."
                                }
                            ]:
                            [
                                "None"
                            ]
                            }
                            onChange={i => setActionRef(i)}
                            defaultValue={field.action ? {
                                value: field.action,
                                label: field.action
                            } : { value: "None", label: "None" }}
                        />
                        {(field.action === "Notify" || actionRef === "Notify") && 
                        <Input
                            key={field.actionValue + "Notify" + field.label}
                            label="Amount"
                            type="number"
                            refVal={actionValueRef}
                            defaultValue={field.actionValue}
                        />}
                    </div>}
                    <Input
                        key={field.position + field.label}
                        label="Position"
                        display="dropdown"
                        values={field.label === "Name" ?
                        [
                            "Top Left"
                        ]
                        :
                        [
                            "Hidden",
                            "Top Right",
                            "Bottom Left",
                            "Bottom Right"
                        ]}
                        refVal={positionRef}
                        defaultValue={field.position ? {
                            value: field.position || "",
                            label: field.position || ""
                        } : ""}
                    />
                    {(field.label !== "Name" && itemRef) &&
                    <Input
                        key={field.transit + "Transit" + field.label}
                        label="Visible in Transit"
                        display="checkbox"
                        refVal={transitRef}
                        defaultValue={field.transit}
                    />}
                    {field.label !== "Name" &&
                    <Input
                        key={field.showLabel + "Show Label" + field.label}
                        label="Show Label?"
                        display="checkbox"
                        refVal={showLabelRef}
                        defaultValue={field.showLabel}
                    />}
                </div>}
            </div>
        </div>
    )
}