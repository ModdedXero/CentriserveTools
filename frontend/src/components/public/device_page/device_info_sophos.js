import React, { useEffect, useState } from "react";

export default function DeviceInfoSophos({ device, deviceList }) {
    const [deviceInfo, setDeviceInfo] = useState({});

    useEffect(() => {
        setDeviceInfo({});
        deviceList.forEach((comp) => {
            if (comp.sophos && comp.sophos.hostname === device) {
                setDeviceInfo(comp.sophos);
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