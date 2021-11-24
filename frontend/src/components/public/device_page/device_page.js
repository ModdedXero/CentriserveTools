import React, { useEffect, useState } from "react";
import axios from "axios";
import fileDownload from "js-file-download";
import Select from "react-select";

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
    const [filterValue, setFilterValue] = useState({ value: "all", label: "All Devices"});
    const [selectedComputer, setSelectedComputer] = useState("");
    const [selectedRow, setSelectedRow] = useState(undefined);

    useEffect(() => {
        axios.get("/api/agents/sites")
            .then(res => {
                setAllSiteNames(res.data.response);
                setLoadingSites(false);
            })
            .catch(err => console.log(err))
    }, [])

    async function UpdateComputerCount(e) {
        setSiteName(e);

        setSophosCount(0);
        setDattoCount(0);
        setComputers([]);
        setSelectedComputer("");

        let site;

        allSiteNames.forEach(siteInfo => {
            if (siteInfo.name === e.value) {
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
        if (selectedRow) selectedRow.className = selectedRow.className.split(" ")[0];

        const comp = e.target.parentElement.outerText.split('\t').find((str) => {
            return str !== "";
        });

        e.target.parentElement.className = e.target.parentElement.className + " selected";
        setSelectedRow(e.target.parentElement)
        setSelectedComputer(comp);
    }

    function GenerateComputerNames() {
        return (
            <tbody>
                {computers.map((comp) => {
                    if (comp.isEqual && (filterName === "all" || filterName === "stable")) {
                        if (!comp.sophos.tamperProtectionEnabled) {
                            return (
                                <tr className="row-yellow">
                                    <td onClick={handleRowClick}>{comp.sophos.hostname}</td>
                                    <td onClick={handleRowClick}>{comp.datto.hostname}</td>
                                </tr>
                            )
                        } else if (comp.sophos.os.isServer) {
                            return (
                                <tr className="row-dark-green">
                                    <td onClick={handleRowClick}>{comp.sophos.hostname}</td>
                                    <td onClick={handleRowClick}>{comp.datto.hostname}</td>
                                </tr>
                            )
                        } else {
                            return (
                                <tr className="row-green">
                                    <td onClick={handleRowClick}>{comp.sophos.hostname}</td>
                                    <td onClick={handleRowClick}>{comp.datto.hostname}</td>
                                </tr>
                            )
                        }
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
        setFilterValue(e);
        setFilterName(e.value);
    }

    const options = GetSelectOptions();

    function GetSelectOptions() {
        let options = [];

        allSiteNames.map((siteName) => {
            options.push({ value: siteName.name, label: siteName.name });
        })

        return options;
    }

    return (
        <div className="app-body">
            <div className="device-page">
                <div>
                    <Select
                        className="react-select" 
                        options={options} 
                        value={siteName} 
                        onChange={UpdateComputerCount}
                    />
                    <div className="flex-row">
                        <Select 
                            className="react-select select-fit" 
                            options={[
                                { value: "all", label: "All Devices" },
                                { value: "stable", label: "Stable Devices" },
                                { value: "error", label: "Error Devices" }
                            ]}
                            value={filterValue} 
                            onChange={UpdateFilter}
                        />
                        <Button onClick={GenerateReport} clickState={loadingReport}>Download Report</Button>
                    </div>
                    <div className="flex-row">
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
                        <div className="tooltip">
                            [i]
                            <span className="tooltip-text">
                                <div className="flex-row">Missing Agent: <div className="row-red box" /></div>
                                <div className="flex-row">Installed Agents: <div className="row-green box" /></div>
                                <div className="flex-row">Server Agent: <div className="row-dark-green box" /></div>
                                <div className="flex-row">Tamper Protection Disabled: <div className="row-yellow box" /></div>
                            </span>
                        </div>
                    </div>
                </div>
                <DeviceInfoDatto device={selectedComputer} deviceList={computers} />
                <DeviceInfoSophos device={selectedComputer} deviceList={computers} />
                {loadingReport && <Notify>Report Generating...</Notify>}
            </div>
        </div>
    );
}