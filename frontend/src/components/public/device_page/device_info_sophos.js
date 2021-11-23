import React, { useEffect, useState } from "react";

export default function DeviceInfoSophos({ device, deviceList }) {
    const [deviceInfo, setDeviceInfo] = useState(undefined);

    useEffect(() => {
        setDeviceInfo(undefined);
        deviceList.forEach((comp) => {
            if (comp.sophos && comp.sophos.hostname === device) {
                setDeviceInfo(comp.sophos);
                return;
            }
        })
    }, [device])

    return(
        <div className="device-page-info">
            <h2>Sophos Device Info</h2>
            <div>
                <h3>Hostname:</h3>
                <h4>{deviceInfo && deviceInfo.hostname}</h4>
            </div>
            <div>
                <h3>Type:</h3>
                <h4>{deviceInfo && (deviceInfo.os.isServer ? "Server" : "Desktop")}</h4>
            </div>
            <div>
                <h3>Platform:</h3>
                <h4>{deviceInfo && deviceInfo.os.platform}</h4>
            </div>
            <div>
                <h3>Last Login:</h3>
                <h4>{deviceInfo && deviceInfo.associatedPerson.viaLogin}</h4>
            </div>
            <div>
                <h3>Internal IP:</h3>
                <h4>{deviceInfo && deviceInfo.ipv4Addresses[0]}</h4>
            </div>
            <div>
                <h3>Tamper Protection:</h3>
                <h4>{deviceInfo && (deviceInfo.tamperProtectionEnabled ? "Enabled" : "Disabled")}</h4>
            </div>
            <div>
                <h3>Overall Health:</h3>
                <h4>{deviceInfo && deviceInfo.health.overall}</h4>
            </div>
        </div>
    )
}