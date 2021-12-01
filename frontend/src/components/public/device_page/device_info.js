import React from "react";
import axios from "axios";
import Button from "../../utility/button";

export default function DeviceInfo({ device, refreshSite }) {
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
            tamper: "",
            sophosHealth: "",
            dattoLink: ""
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
            currentDevice.dattoLink = device.datto.portalUrl;
        } else if (device && device.sophos) {
            currentDevice.hostname = device.sophos.hostname;
            currentDevice.type = (device.sophos.os.isServer ? "Server" : "Desktop")
            currentDevice.platform = device.sophos.os.platform;
            currentDevice.lastLogin = device.sophos.associatedPerson.viaLogin;
            currentDevice.extIp = "Unavailable";
            currentDevice.intIp = device.sophos.ipv4Addresses[0];
            currentDevice.antivirus = "Sophos";
            currentDevice.domain = "Unavailable";
        }

        if (device && device.sophos) {
            currentDevice.tamper = device.sophos.tamperProtectionEnabled ? "Enabled" : "Disabled";
            currentDevice.sophosHealth = device.sophos.health.overall;
        } else if (device && !device.sophos) {
            currentDevice.tamper = "Unavailable";
            currentDevice.sophosHealth = "Unavailable";
        }

        return (
            <div className="device-page-info">
                <h2>Device Info</h2>
                {currentDevice.dattoLink && <Button onClick={OpenDattoSiteDevice}>Open Device On Datto</Button>}
                <div>
                    <h3>Hostname:</h3>
                    <h4>{currentDevice.hostname}</h4>
                </div>
                <div>
                    <h3>Type:</h3>
                    <h4>{currentDevice.type}</h4>
                </div>
                <div>
                    <h3>Platform:</h3>
                    <h4>{currentDevice.platform}</h4>
                </div>
                <div>
                    <h3>Last Login:</h3>
                    <h4>{currentDevice.lastLogin}</h4>
                </div>
                <div>
                    <h3>Domain:</h3>
                    <h4>{currentDevice.domain}</h4>
                </div>
                <div>
                    <h3>Internal IP:</h3>
                    <h4>{currentDevice.intIp}</h4>
                </div>
                <div>
                    <h3>External IP:</h3>
                    <h4>{currentDevice.extIp}</h4>
                </div>
                <div>
                    <h3>Antivirus:</h3>
                    <h4>{currentDevice.antivirus}</h4>
                </div>
                <div>
                    <h3>Tamper Protection:</h3>
                    <h4>{currentDevice.tamper}</h4>
                    {
                        currentDevice.tamper === "Disabled" &&
                        <Button onClick={EnableTamperProtection}>Enable Tamper Protection</Button>
                    }
                </div>
                <div>
                    <h3>Sophos Agent Health:</h3>
                    <h4>{currentDevice.sophosHealth}</h4>
                </div>
            </div>
        )
    }

    return GenerateInfo();
}