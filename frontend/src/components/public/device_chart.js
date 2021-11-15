import React, { useEffect, useState } from "react";
import axios from "axios";
import fileDownload from "js-file-download";

import Notify from "../utility/notify";
import Button from "../utility/button";

export default function DeviceChart() {
    const [sophosCount, setSophosCount] = useState(0);
    const [dattoCount, setDattoCount] = useState(0);
    const [computers, setComputers] = useState([]);
    const [allSiteNames, setAllSiteNames] = useState([]);

    const [loadingReport, setLoadingReport] = useState(false);
    const [loadingSites, setLoadingSites] = useState(true);
    const [siteName, setSiteName] = useState("");

    useEffect(() => {
        axios.get("/api/sophos/sites")
            .then(res => {
                setAllSiteNames(res.data.response);
                setLoadingSites(false);
        })
    }, [])

    async function UpdateComputerCount(e) {
        setSiteName(e.target.value);
    
        setSophosCount(0);
        setDattoCount(0);
        setComputers([]);
    
        await axios.get(`/api/agents/devices/${e.target.value}`)
            .then(res => {
                setComputers(res.data.response.comparison);
                setDattoCount(res.data.response.dattoCount);
                setSophosCount(res.data.response.sophosCount);
            })
    };

    function GenerateComputerNames() {
        return (
            <div className="table-wrapper">
                {loadingSites && <Notify>Site list loading...</Notify>}
                <table>
                    <thead>
                        <tr>
                        <th>Sophos Computers: {sophosCount}</th>
                        <th>Datto Computers: {dattoCount}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {computers.map((comp) => {
                        if (comp.isEqual) {
                            return (
                            <tr className="row-green">
                                <td>{comp.sophos}</td>
                                <td>{comp.datto}</td>
                            </tr>
                            )
                        } else {
                            return (
                            <tr className="row-red">
                                <td>{comp.sophos ? comp.sophos : ""}</td>
                                <td>{comp.datto ? comp.datto : ""}</td>
                            </tr>
                            )
                        }
                        })}
                    </tbody>
                </table>
            </div>
        )
    }

    async function GenerateReport() {
        setLoadingReport(true);
        
        await axios.get(`/api/agents/report/site/${siteName}`, { responseType: "arraybuffer" })
            .then(res => {
                let blob = new Blob(
                    [res.data], 
                    { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
                );
                
                fileDownload(blob, `${siteName} Agent Report.xlsx`);
                setLoadingReport(false);
          })
    }

    return (
        <div className="app-body">
            <select className="site-name-select" value={siteName} onChange={UpdateComputerCount}>
                <option>Select Site...</option>
                {allSiteNames.map((siteName) => {
                    return <option value={siteName}>{siteName}</option>
                })}
            </select>
            {GenerateComputerNames()}
            <Button onClick={GenerateReport} clickState={loadingReport}>Download Report</Button>
            {loadingReport && <Notify>Report Generating...</Notify>}
        </div>
    );
}