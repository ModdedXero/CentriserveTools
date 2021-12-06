import React from "react";
import axios from "axios";
import Button from "../../utility/button";

export default function DeviceInfo({ device, refreshSite, filter }) {
    function OpenDattoSiteDevice() {
        if (device) {
            window.open(device.datto.portalUrl);
        }
    }

    async function EnableTamperProtection() {
        await axios.post(`/api/sophos/enabletamper`, { id: device.sophos.id, tenantId: device.sophos.tenant.id })
            .then(res => { refreshSite(); })
            .catch(err => console.log(err));
    }

    function GenerateInfo() {
        let currentDevice = {
            hostname: "",
            type: "",
            platform: "",
            lastLogin: "",
            domain: "",
            intIp: "",
            extIp: "",
            antivirus: "",
            datto: "",
            tamper: "",
            sophos: "",
            dattoLink: ""
        }

        if (filter === "stable" && !device.isEqual) {
            return false;
        } else if (filter === "error" && device.isEqual) {
            return false;
        }

        if (device && device.datto) {
            currentDevice.hostname = device.datto.hostname;
            currentDevice.type = device.datto.deviceType.category;
            currentDevice.platform = device.datto.operatingSystem;
            currentDevice.lastLogin = device.datto.lastLoggedInUser;
            currentDevice.domain = device.datto.domain;
            currentDevice.intIp = device.datto.intIpAddress;
            currentDevice.extIp = device.datto.extIpAddress;
            currentDevice.antivirus = device.datto.antivirus.antivirusProduct;
            currentDevice.datto = "Installed"
            currentDevice.dattoLink = device.datto.portalUrl;
        } else if (device && device.sophos) {
            currentDevice.hostname = device.sophos.hostname;
            currentDevice.type = (device.sophos.os.isServer ? "Server" : "Desktop")
            currentDevice.platform = device.sophos.os.platform;
            currentDevice.lastLogin = device.sophos.associatedPerson.viaLogin;
            currentDevice.extIp = "Unavailable";
            currentDevice.intIp = device.sophos.ipv4Addresses[0];
            currentDevice.antivirus = "Sophos";
            currentDevice.datto = "Not Installed";
            currentDevice.domain = "Unavailable";
        }

        if (device && device.sophos) {
            currentDevice.tamper = device.sophos.tamperProtectionEnabled ? "Enabled" : "Disabled";
            currentDevice.sophos = "Installed";
        } else if (device && !device.sophos) {
            currentDevice.tamper = "Unavailable";
            currentDevice.sophos = "Not Installed";
        }

        return (
            <tr>
                <td>{currentDevice.hostname}</td>
                <td>{currentDevice.type}</td>
                <td>{currentDevice.platform}</td>
                <td>{currentDevice.lastLogin}</td>
                <td>{currentDevice.domain}</td>
                <td>{currentDevice.intIp}</td>
                <td>{currentDevice.extIp}</td>
                <td>{currentDevice.antivirus}</td>
                <td>                    
                    {currentDevice.dattoLink 
                    ? <Button onClick={OpenDattoSiteDevice}>Installed</Button> 
                    : "Not Installed"}</td>
                <td>{currentDevice.sophos}</td>
                <td>
                    {currentDevice.tamper === "Disabled" 
                    ? <Button onClick={EnableTamperProtection}>Disabled</Button>
                    : currentDevice.tamper}
                </td>
            </tr>
        )
    }

    return GenerateInfo();
}