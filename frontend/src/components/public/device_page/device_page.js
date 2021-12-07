import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";

import Notify from "../../utility/notify";
import Button from "../../utility/button";
import DeviceInfo from "./device_info";

export default function DevicePage() {
    const [sophosCount, setSophosCount] = useState(0);
    const [dattoCount, setDattoCount] = useState(0);
    const [dattoAgentLink, setDattoAgentLink] = useState("");
    const [computers, setComputers] = useState([]);
    const [allSiteNames, setAllSiteNames] = useState([]);

    const [loadingSites, setLoadingSites] = useState(true);
    const [siteName, setSiteName] = useState("");
    const [filterName, setFilterName] = useState("all");
    const [filterValue, setFilterValue] = useState({ value: "all", label: "All Devices"});

    useEffect(() => {
        axios.get("/api/agents/sites")
            .then(res => {
                setAllSiteNames(res.data.response);
                setLoadingSites(false);
            })
            .catch(err => console.log(err))
    }, [])

    function RefreshSite() {
        UpdateComputerCount(siteName);
    }

    async function UpdateComputerCount(e) {
        setSiteName(e);

        setSophosCount(0);
        setDattoCount(0);
        setComputers([]);
        setDattoAgentLink("");

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

                res.data.response.comparison.some((comp) => {
                    if (comp.datto) {
                        setDattoAgentLink(comp.datto.siteUid);
                        return true;
                    }
                })
            })
    };

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

    function DownloadAgent() {
        window.open(`https://zinfandel.centrastage.net/csm/profile/downloadAgent/${dattoAgentLink}`);
    }

    return (
        <div className="app-body">
            <div className="device-page">
                <div>
                    <Select
                        className="react-select site-select"
                        options={options}
                        value={siteName}
                        onChange={UpdateComputerCount}
                    />
                    <Select 
                        className="react-select select-fit"
                        options={[
                            { value: "all", label: "All Devices" },
                            { value: "stable", label: "Stable Devices" },
                            { value: "error", label: "Error Devices" },
                        ]}
                        value={filterValue}
                        onChange={UpdateFilter}
                    />
                </div>
                <div className="flex margin-top add-gap">
                    <Button onClick={DownloadAgent}>Download Datto Agent</Button>
                    <Button onClick={RefreshSite}>Refresh Site</Button>
                </div>
                <div className="table-info">
                    <p>{`Sophos Count: ${sophosCount}`}</p>
                    <p>{`Datto Count: ${dattoCount}`}</p>
                    <p>{`Computer Count: ${computers.length}`}</p>
                </div>
                <div className="table-wrapper">
                    <table style={{ width: "100%" }}>
                        <thead>
                            <tr style={{ width: "100%" }}>
                                <th style={{ width: "104px" }}>Hostname</th>
                                <th style={{ width: "70px" }}>Type</th>
                                <th style={{ width: "101px" }}>Platform</th>
                                <th style={{ width: "127px" }}>Last User</th>
                                <th style={{ width: "75px" }}>Domain</th>
                                <th style={{ width: "101px" }}>Internal IP</th>
                                <th style={{ width: "101px" }}>External IP</th>
                                <th style={{ width: "82px" }}>Antivirus</th>
                                <th style={{ width: "83px" }}>Datto</th>
                                <th style={{ width: "72px" }}>Sophos Portal</th>
                                <th style={{ width: "88px" }}>Tamper Protection</th>
                            </tr>
                        </thead>
                        <tbody>
                            {computers.map((comp) => {
                                return <DeviceInfo device={comp} refreshSite={RefreshSite} filter={filterName} />
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}