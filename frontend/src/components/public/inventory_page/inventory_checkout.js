import React, { useEffect, useState } from "react";
import axios from "axios";

import Input from "../../utility/input";
import Notify from "../../utility/notify";

export default function InventoryCheckout({ location, categories, checkoutList, setList }) {
    const [notifyData, setNotifyData] = useState();

    function ReturnItem(item, category, listIndex, index) {
        for(let i = 0; i < categories.length; i++) {
            if (categories[i].name === category) {
                for (let j = 0; j < categories[i].items.length; j++) {
                    if (categories[i].items[j].name === item.name) {
                        if (categories[i].collapsed) {
                            categories[i].items[j].amount += parseInt(item.amount) || 1;
                        } else {
                            categories[i].items[j].amount += 1;
                            categories[i].items[j].shelf.push(item);
                        }
                        const retList = [...checkoutList];
                        retList[listIndex].items.splice(index, 1);

                        setList(retList);
                        break;
                    }
                }
            }
        }
    }

    async function SubmitCheckout(e) {
        e.preventDefault();

        if (!checkoutList.length) {
            setNotifyData("Add items to checkout!");
            return;
        }

        await axios.post(`/api/inventory/checkout/${location}`, { data: checkoutList })
            .then(async res => {
                if (res === "Verified") {
                    setNotifyData("Items Checked Out!");
                } else {
                    setNotifyData("Items are not available for checkout!");
                }
            })
            .catch(err => setNotifyData("Items are not available for checkout!"))
    }

    return (
        <form className="inv-b-checkout" onSubmit={SubmitCheckout}>
            <Notify data={notifyData} setData={setNotifyData} />
            <Input 
                defaultValue={"Checkout"}
                readOnly
            />
            <div className="inv-b-checkout-items">
                <Input 
                    defaultValue={"Items"}
                    readOnly
                />
                <div className="inv-b-checkout-items-list">
                    {checkoutList.map((item, index) => {
                        if (!item.items.length) return null;
                        return (
                            <div key={index}>
                                <h1>{item.category}</h1>
                                {item.items.map((subItem, index1) => {
                                    return (
                                        <div className="inv-b-checkout-items-list-val" key={index1}>
                                            <p>{subItem.name}</p>
                                            {subItem.fields.map((field, index2) => {
                                                if (!field.checkout) return null;

                                                return (
                                                    <p key={index2}>
                                                        {field.label}: {field.value}
                                                    </p>
                                                )
                                            })}
                                            <Input
                                                display="button"
                                                label="Return"
                                                onClick={_ => ReturnItem(subItem, item.category, index, index1)}
                                            />
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className="inv-b-checkout-reason">
                <Input 
                    defaultValue={"Reason"}
                    readOnly
                />
                <Input 
                    display="textarea"
                    required
                />
            </div>
            <Input 
                label="Ticket Number"
                required
            />
            <Input
                display="button"
                label="Submit Checkout"
                type="submit"
            />
        </form>
    )
}