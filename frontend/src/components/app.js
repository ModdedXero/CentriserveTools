import React from "react";
import { Switch } from "react-router";

import DynamicRoute from "./utility/dynamic_route";

import DeviceChart from "./public/device_chart";
import Reports from "./public/reports/reports";

import "../styles/app.css"

export default function App() {
    return (
        <Switch>
            <DynamicRoute exact path="/" component={DeviceChart} />
            <DynamicRoute path="/reports" component={Reports} />
        </Switch>
    )
}