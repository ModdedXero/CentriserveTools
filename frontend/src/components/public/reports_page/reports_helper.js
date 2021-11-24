import React from "react";
import axios from "axios";
import fileDownload from "js-file-download";

import Button from "../../utility/button";

export const AvailableReports = [
    {
        report: "All Sites Agent Comparison",
        buttonHtml: <Button onClick={GenerateReportAll}>Download Report</Button>
    },
    {
        report: "All Sites Error Agent Comparison",
        buttonHtml: <Button onClick={GenerateErrorReportAll}>Download Report</Button>
    },
    {
        report: "All Sites Tamper Protection Check",
        buttonHtml: <Button onClick={GenerateTamperCheckReport}>Download Report</Button>
    }
]

async function GenerateReportAll() {
    await DownloadReport("all", "All Sites Agent Report");
}

async function GenerateErrorReportAll() {
    await DownloadReport("error", "All Sites Error Agent Report");
}

async function GenerateTamperCheckReport() {
    await DownloadReport("tamperprotection", "All Sites Tamper Protection Check");
}

async function DownloadReport(url, title) {
    await axios.get(`/api/agents/report/${url}`, { responseType: "arraybuffer" })
        .then(res => {
            let blob = new Blob(
                [res.data], 
                { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" }
            );
            
            fileDownload(blob, `${title}.xlsx`);
        })
}