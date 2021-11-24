import React, { useEffect, useState } from "react";
import Button from "../../utility/button";

export default function DeviceInfoDatto({ device, deviceList }) {
    const [deviceInfo, setDeviceInfo] = useState(undefined);

    useEffect(() => {
        setDeviceInfo(undefined);
        deviceList.forEach((comp) => {
            if (comp.datto && comp.datto.hostname === device) {
                setDeviceInfo(comp.datto);
                return;
            }
        })
    }, [device])

    function OpenDattoSiteDevice() {
        if (deviceInfo) {
            window.open(deviceInfo.portalUrl);
        }
    }

    return(
        <div className="device-page-info">
            <h2>Datto Device Info</h2>
            <Button onClick={OpenDattoSiteDevice}>Open Device On Datto</Button>
            <div>
                <h3>Hostname:</h3>
                <h4>{deviceInfo && deviceInfo.hostname}</h4>
            </div>
            <div>
                <h3>Type:</h3>
                <h4>{deviceInfo && deviceInfo.deviceType.type}</h4>
            </div>
            <div>
                <h3>Platform:</h3>
                <h4>{deviceInfo && deviceInfo.operatingSystem}</h4>
            </div>
            <div>
                <h3>Last Login:</h3>
                <h4>{deviceInfo && deviceInfo.lastLoggedInUser}</h4>
            </div>
            <div>
                <h3>Domain:</h3>
                <h4>{deviceInfo && deviceInfo.domain}</h4>
            </div>
            <div>
                <h3>Internal IP:</h3>
                <h4>{deviceInfo && deviceInfo.intIpAddress}</h4>
            </div>
            <div>
                <h3>External IP:</h3>
                <h4>{deviceInfo && deviceInfo.extIpAddress}</h4>
            </div>
            <div>
                <h3>Antivirus:</h3>
                <h4>{deviceInfo && deviceInfo.antivirus.antivirusProduct}</h4>
            </div>
        </div>
    )
}