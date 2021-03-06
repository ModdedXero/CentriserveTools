import React from "react";
import "../../../styles/reports_page.css";

import { AvailableReports } from "./reports_helper";

export default function Reports() {
    return (
        <div className="app-body">
            <div className="report-page">
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Report Type</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {AvailableReports.map((rep) => {
                                return (
                                    <tr className="row-green">
                                        <td>{rep.report}</td>
                                        <td>{rep.buttonHtml}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}