import React from "react";
import axios from "axios";
import fileDownload from "js-file-download";

import Button from "../../utility/button";

export const AvailableReports = [
    {
        report: "All Sites Agent Comparison",
        buttonHtml: <Button onClick={GenerateReportAll}>Download Report</Button>
    }
]

async function GenerateReportAll() {
    await axios.get(`/api/agents/report/site/all`, { responseType: "arraybuffer" })
        .then(res => {
            let blob = new Blob(
                [res.data], 
                { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" }
            );
            
            fileDownload(blob, `All Sites Agent Report.xlsx`);
        })
}