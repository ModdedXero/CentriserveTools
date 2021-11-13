import React from "react";
import { Switch } from "react-router";

import DynamicRoute from "./utility/dynamic_route";

import DeviceChart from "./public/device_chart";

import "../styles/app.css"

export default function App() {
    return (
        <Switch>
            <DynamicRoute path="/" component={DeviceChart} />
        </Switch>
    )
}