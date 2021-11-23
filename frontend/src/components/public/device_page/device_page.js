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
    const [selectedComputer, setSelectedComputer] = useState("");

    useEffect(() => {
        axios.get("/api/agents/sites")
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
        setSelectedComputer("");

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

    function handleRowClick(e) {
        const comp = e.target.parentElement.outerText.split('\t').find((str) => {
            return str !== "";
        });

        setSelectedComputer(comp);
    }

    function GenerateComputerNames() {
        return (
            <tbody>
                {computers.map((comp) => {
                    if (comp.isEqual && (filterName === "all" || filterName === "stable")) {
                        return (
                            <tr onClick={(e) => console.log(e.target.outerText)} className="row-green">
                                <td onClick={handleRowClick}>{comp.sophos.hostname}</td>
                                <td onClick={handleRowClick}>{comp.datto.hostname}</td>
                            </tr>
                        )
                    } else if (!comp.isEqual && filterName !== "stable") {
                        return (
                            <tr className="row-red">
                                <td onClick={handleRowClick}>{comp.sophos ? comp.sophos.hostname : ""}</td>
                                <td onClick={handleRowClick}>{comp.datto ? comp.datto.hostname : ""}</td>
                            </tr>
                        )
                    }
                })}
            </tbody>
        )
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
                <div>
                    <select className="select-full" value={siteName} onChange={UpdateComputerCount}>
                        <option>Select Site...</option>
                        {allSiteNames.map((siteName) => {
                            return <option value={siteName.name}>{siteName.name}</option>
                        })}
                    </select>
                    <br />
                    <select className="select-fit" value={filterName} onChange={UpdateFilter}>
                        <option value="all">All Devices</option>
                        <option value="stable">Stable Devices</option>
                        <option value="error">Error Devices</option>
                    </select>
                    <br />
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
                </div>
                <DeviceInfoDatto device={selectedComputer} deviceList={computers} />
                <DeviceInfoSophos device={selectedComputer} deviceList={computers} />
                {loadingReport && <Notify>Report Generating...</Notify>}
            </div>
        </div>
    );
}