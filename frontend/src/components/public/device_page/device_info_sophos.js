import React, { useEffect, useState } from "react";
import Button from "../../utility/button";

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

    function OpenSophosSiteDevice() {
        if (deviceInfo) {
            let idCopy = deviceInfo.id;
            let strArray = [];
            for (let i = 0; i < idCopy.length; i++) {
                if (idCopy[i] === "-") {
                    strArray.push("-");
                    idCopy = idCopy.split("").splice(i, 1).join("");
                }

                if (i % 2 === 0) {
                    strArray.push(idCopy[i]);
                    strArray.push(idCopy[i - 1]);
                }
            }

            console.log(deviceInfo);
            window.open(`https://cloud.sophos.com/manage/devices/computers/${deviceInfo.cloud.instanceId}`);
        }
    }

    return(
        <div className="device-page-info">
            <h2>Sophos Device Info</h2>
            <Button onClick={OpenSophosSiteDevice}>Open Device On Sophos</Button>
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