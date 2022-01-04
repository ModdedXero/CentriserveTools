import React, { useRef } from "react";
import axios from "axios";

import Button from "../../utility/button";

export default function InventoryCheckoutForm({ location, checkoutData }) {
    const checkoutReasonRef = useRef();

    function SubmitCheckout() {
        axios.post("/")
    }

    return (
        <form className="form checkout-form" onSubmit={SubmitCheckout}>
            <div className="checkout-form-list">
                <label>Items</label>
                <div className="checkout-list-container">
                    {checkoutData.map((data, index) => {
                        return(
                            <div className="checkout-list-category" key={index}>
                                <h2>{data.category.name.toUpperCase()}</h2>
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
                <label>Reason</label>
                <textarea ref={checkoutReasonRef} required />
            </div>
            <Button type="submit">Submit</Button>
        </form>
    )
}