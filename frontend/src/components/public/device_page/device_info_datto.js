import React, { useEffect, useState } from "react";

export default function DeviceInfoDatto({ device, deviceList }) {
    const [deviceInfo, setDeviceInfo] = useState({});

    useEffect(() => {
        setDeviceInfo({});
        deviceList.forEach((comp) => {
            if (comp.datto && comp.datto.hostname === device) {
                setDeviceInfo(comp.datto);
                return;
            }
        })
    }, [device])

    return(
        <div>
            {deviceInfo && deviceInfo.hostname}
        </div>
    )
}