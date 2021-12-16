import React from "react";
import { Switch, withRouter } from "react-router";

import DynamicRoute from "./utility/dynamic_route";

import DevicePage from "./public/device_page/device_page";
import Reports from "./public/reports_page/reports_page";
import DownloadPage from "./public/download_page/download_page";

import LoginPage from "./public/login/login_page";
import SignupPage from "./public/login/signup_page";


import AdminPage from "./admin/admin_page/admin_page";

import "../styles/app.css"

function App() {
    return (
        <Switch>
            <DynamicRoute exact path="/" component={DevicePage} />
            <DynamicRoute path="/reports" component={Reports} />
            <DynamicRoute path="/downloads" component={DownloadPage} />

            <DynamicRoute path="/login" nonav notsecure component={LoginPage} />
            <DynamicRoute path="/signup" nonav notsecure component={SignupPage} />

            <DynamicRoute path="/admin" adminLevel={5} component={AdminPage} />
        </Switch>
    )
}

export default withRouter(App);