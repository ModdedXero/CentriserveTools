import React from "react";
import { Switch } from "react-router";

import DynamicRoute from "./utility/dynamic_route";

import DevicePage from "./public/device_page/device_page";
import Reports from "./public/reports_page/reports_page";

import "../styles/app.css"

export default function App() {
    return (
        <Switch>
            <DynamicRoute exact path="/" component={DevicePage} />
            <DynamicRoute path="/reports" component={Reports} />
        </Switch>
    )
}