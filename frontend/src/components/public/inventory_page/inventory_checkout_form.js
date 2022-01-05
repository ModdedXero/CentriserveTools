import React, { useRef } from "react";
import axios from "axios";

import { useAuth } from "../../../contexts/auth_context";
import Button from "../../utility/button";

export default function InventoryCheckoutForm({ location, checkoutData }) {
    const { currentUser } = useAuth();

    const checkoutReasonRef = useRef();

    function SubmitCheckout() {
        axios.post("/api/inventory/checkout", {
            location: location,
            checkoutData: checkoutData,
            reason: checkoutReasonRef.current.value,
            user: currentUser.username
        })
        .then(window.location.reload());
    }

    return (
        <form className="form checkout-form" onSubmit={SubmitCheckout}>
            <div className="checkout-form-list">
                <label>Items:</label>
                <div className="checkout-list-container">
                    {checkoutData.map((data, index) => {
                        return(
                            <div className="checkout-list-category" key={index}>
                                <h2>{data.category.toUpperCase()}</h2>
                                <div>
                                    {data.items.map((item, ind) => {
                                        return (
                                            <div className="checkout-list-item" key={ind}>
                                                <p>{item.name}</p>
                                                <p>$ {item.price}</p>
                                                {!item.serial && <p>{item.amount}</p>}
                                                {item.serial && <p>{item.serial}</p>}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div>
                <label>Reason:</label>
                <textarea ref={checkoutReasonRef} required />
            </div>
            <Button type="submit">Submit</Button>
        </form>
    )
}