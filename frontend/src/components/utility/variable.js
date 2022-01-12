import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

// Class to manage retrieving data and using realtime variables
export class Variable {
    constructor (api, sync = false) {
        this.api = api;
        this.sync = sync;
    }

    // Used as a custom hook to get data
    useVar(variable, defaultVal) {
        const [data, setData] = useState(null);

        this.variable = variable;

        useEffect(async () => {
            if (variable) {
                await axios.post(`/api/${this.api}/${variable}`)
                    .then(res => setData(res.data));
            }
        }, [variable]);

        if (this.sync) {
            useEffect(() => {
                if (variable) {
                    const socket = io(`http://${window.location.hostname}:5000`);
                    socket.on(`${this.api}-${variable}`, i => setData(i));
                }
            }, [variable]);
        }
    
        return data ? data : defaultVal;
    }

    // Used to update the new data to upload
    createVar(newVar) {
        this.newVar = newVar;
    }

    updateVar(newVar, oldVar) {
        this.upVar = newVar;
        this.oldVar = oldVar;
    }

    removeVar(delVar) {
        this.delVar = delVar;
    }

    // Called to upload the data to the server
    syncVar() {
        if (this.newVar)
            axios.post(`/api/${this.api}/create/${this.variable}`, { newVar: this.newVar });
        if (this.upVar && this.oldVar)
            axios.post(`/api/${this.api}/update/${this.variable}`, { upVar: this.upVar, oldVar: this.oldVar });
        if (this.delVar)
            axios.post(`/api/${this.api}/delete/${this.variable}`, { delVar: this.delVar });

        this.newVar = null;
        this.upVar = null;
        this.oldVar = null;
        this.delVar = null;
    }
}

export const APIs = Object.freeze({
    Inventory: "inventory",
    Test: "test"
});