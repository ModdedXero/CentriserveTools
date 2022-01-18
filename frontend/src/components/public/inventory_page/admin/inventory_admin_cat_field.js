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
    const [headerRef, setHeaderRef] = useState(field.header);
    const [itemRef, setItemRef] = useState(field.item);
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
                        key={field.addItem + "Item" + field.label}
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
                                {
                                    value: "Text",
                                    label: "Text"
                                },
                                {
                                    value: "List",
                                    label: "List"
                                }
                            ]
                            :
                            (headerRef ? 
                                [
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
                                    }
                                ]
                                :
                                [
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
                    {(field.label !== "Name" && !itemRef) &&
                    <div className="inv-admin-data-row">
                        <Input
                            key={field.action + field.label}
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
                                },
                                {
                                    value: "Total",
                                    label: "Total",
                                    description: "Only for Type Number | Displays the total amount of items"
                                },
                                {
                                    value: "Sum",
                                    label: "Sum",
                                    description: "Only for Type Number | Displays sum of linked Item Field"
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
                            {
                                value: "Top Left",
                                label: "Top Left"
                            }
                        ]
                        :
                        [
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