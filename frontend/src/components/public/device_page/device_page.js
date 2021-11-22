import React, { useEffect, useState } from "react";
import axios from "axios";
import fileDownload from "js-file-download";

import Notify from "../../utility/notify";
import Button from "../../utility/button";
import DeviceInfoDatto from "./device_info_datto";
import DeviceInfoSophos from "./device_info_sophos";

export default function DevicePage() {
    const [sophosCount, setSophosCount] = useState(0);
    const [dattoCount, setDattoCount] = useState(0);
    const [computers, setComputers] = useState([]);
    const [allSiteNames, setAllSiteNames] = useState([]);

    const [loadingReport, setLoadingReport] = useState(false);
    const [loadingSites, setLoadingSites] = useState(true);
    const [siteName, setSiteName] = useState("");
    const [filterName, setFilterName] = useState("all");

    useEffect(() => {
        axios.get("/api/agents/sites")
            .then(res => {
                setAllSiteNames(res.data.response);
                setLoadingSites(false);
        })
    }, [])

    async function UpdateComputerCount(e) {
        setSiteName(e.target.value);

        console.log("l");
    
        setSophosCount(0);
        setDattoCount(0);
        setComputers([]);

        let site;

        allSiteNames.forEach(siteInfo => {
            if (siteInfo.name === e.target.value) {
                site = siteInfo;
            }
        })
    
        await axios.post(`/api/agents/devices`, { sitename: site })
            .then(res => {
                setComputers(res.data.response.comparison);
                setDattoCount(res.data.response.dattoCount);
                setSophosCount(res.data.response.sophosCount);
            })
    };

    function GenerateComputerNames() {
        switch(filterName) {
            case "all":
                return (
                    <tbody>
                        {computers.map((comp) => {
                            if (comp.isEqual) {
                                return (
                                <tr className="row-green">
                                    <td>{comp.sophos.hostname}</td>
                                    <td>{comp.datto.hostname}</td>
                                </tr>
                                )
                            } else {
                                return (
                                <tr className="row-red">
                                    <td>{comp.sophos ? comp.sophos.hostname : ""}</td>
                                    <td>{comp.datto ? comp.datto.hostname : ""}</td>
                                </tr>
                                )
                            }
                        })}
                    </tbody>
                )
            case "stable":
                return (
                    <tbody>
                        {computers.map((comp) => {
                            if (comp.isEqual) {
                                return (
                                <tr className="row-green">
                                    <td>{comp.sophos.hostname}</td>
                                    <td>{comp.datto.hostname}</td>
                                </tr>
                                )
                            }
                        })}
                    </tbody>
                )
            case "error":
                return (
                    <tbody>
                        {computers.map((comp) => {
                            if (!comp.isEqual) {
                                return (
                                    <tr className="row-red">
                                        <td>{comp.sophos ? comp.sophos.hostname : ""}</td>
                                        <td>{comp.datto ? comp.datto.hostname : ""}</td>
                                    </tr>
                                )
                            }
                        })}
                    </tbody>
                )
            default:

        }
    }

    async function GenerateReport(e) {
        setLoadingReport(true);

        let site;

        allSiteNames.forEach(siteInfo => {
            if (siteInfo.name === siteName) {
                site = siteInfo;
            }
        })
        
        await axios.post(`/api/agents/report/site`, { sitename: site }, { responseType: "arraybuffer" })
            .then(res => {
                let blob = new Blob(
                    [res.data], 
                    { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
                );
                
                fileDownload(blob, `${siteName} Agent Report.xlsx`);
                setLoadingReport(false);
          })
    }

    function UpdateFilter(e) {
        setFilterName(e.target.value);
    }

    return (
        <div className="app-body">
            <div className="device-page">
                <select className="site-name-select" value={siteName} onChange={UpdateComputerCount}>
                    <option>Select Site...</option>
                    {allSiteNames.map((siteName) => {
                        return <option value={siteName.name}>{siteName.name}</option>
                    })}
                </select>
                <br />
                <select className="site-name-select" value={filterName} onChange={UpdateFilter}>
                    <option value="all">All Devices</option>
                    <option value="stable">Stable Devices</option>
                    <option value="error">Error Devices</option>
                </select>
                <Button onClick={GenerateReport} clickState={loadingReport}>Download Report</Button>
                <div className="table-wrapper">
                    {loadingSites && <Notify>Site list loading...</Notify>}
                    <table>
                        <thead>
                            <tr>
                            <th>Sophos Computers: {sophosCount}</th>
                            <th>Datto Computers: {dattoCount}</th>
                            </tr>
                        </thead>
                        {GenerateComputerNames()}
                    </table>
                </div>
                {loadingReport && <Notify>Report Generating...</Notify>}
                <DeviceInfoDatto />
                <DeviceInfoSophos />
            </div>
        </div>
    );
}