import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

// Class to manage retrieving data and using realtime variables
export class Variable {
    constructor (api, variable, sync = false) {
        this.api = api;
        this.variable = variable;
        this.sync = sync;
    }

    // Used as a custom hook to get data
    useVar() {
        const [data, setData] = useState(null);

        useEffect(async () => {
            await axios.post(`/api/${this.api}/${this.variable}`)
                    .then(res => setData(res.data));
        }, []);

        if (this.sync) {
            useEffect(() => {
                const socket = io(`http://${window.location.hostname}:5000`);
                socket.on(`${this.api}-${this.variable}`, i => setData(i));
            }, []);
        }
    
        return data;
    }

    // Used to update the new data to upload
    setVar(newVar) {
        this.newVar = newVar;
    }

    // Called to upload the data to the server
    syncVar() {
        axios.post(`/api/${this.api}/update/${this.variable}`, { newVar: this.newVar });
    }
}

export const APIs = Object.freeze({
    Inventory: "inventory",
    Test: "test"
});