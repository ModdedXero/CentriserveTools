import React, { useEffect, useState } from "react";
import axios from "axios";

import Notify from "./components/utility/notify";

import "./app.css";

function App() {
  const [sophosCount, setSophosCount] = useState(0);
  const [dattoCount, setDattoCount] = useState(0);
  const [sophosComputerNames, setSophosComputerNames] = useState([]);
  const [dattoComputerNames, setDattoComputerNames] = useState([]);
  const [allSiteNames, setAllSiteNames] = useState([]);

  const [loadingSites, setLoadingSites] = useState(true);
  const [siteName, setSiteName] = useState("");

  useEffect(() => {
    axios.get("/api/sophos/sites")
      .then(res => {
        setAllSiteNames(res.data.response);
        setLoadingSites(false);
      })
  }, [])

  async function UpdateComputerCount(e) {
    setSiteName(e.target.value);

    setSophosCount(0);
    setDattoCount(0);
    setSophosComputerNames([]);
    setDattoComputerNames([]);

    await axios.get(`/api/sophos/devices/${e.target.value}`)
      .then(res => { 
        setSophosComputerNames(res.data.response.sort((a, b) => a.localeCompare(b)));
        setSophosCount(res.data.response.length)
      })

    await axios.get(`/api/datto/devices/${e.target.value}`)
      .then(res => {
        setDattoComputerNames(res.data.response.sort((a, b) => a.localeCompare(b)));
        setDattoCount(res.data.response.length);
      })
  };

  function strcmp(a, b) {
    if (a === b) return 0;
    if (a > b) return 1;
    return -1;
  }

  function GenerateComputerNames() {
    const length = sophosCount > dattoCount ? sophosCount : dattoCount;
    let deviceComp = [];

    for (let i = 0; i < length; i++) {
      if (sophosComputerNames[i] && dattoComputerNames[i]) {
        switch (strcmp(sophosComputerNames[i], dattoComputerNames[i])) {
          case 0: 
            deviceComp.push({ isEqual: true, datto: dattoComputerNames[i], sophos: sophosComputerNames[i] });
            break;
          case -1:
            dattoComputerNames.splice(i, 0, undefined);
            deviceComp.push({ isEqual: false, datto: undefined, sophos: sophosComputerNames[i] });
            break;
          case 1:
            sophosComputerNames.splice(i, 0, undefined)
            deviceComp.push({ isEqual: false, datto: dattoComputerNames[i], sophos: undefined });
            break;
          default:
            console.log("Error sorting devices!");
        }
      } else {
        if (sophosComputerNames[i] && !dattoComputerNames[i]) {
          deviceComp.push({ isEqual: false, datto: undefined, sophos: sophosComputerNames[i] });
        } else if (!sophosComputerNames[i] && dattoComputerNames[i]) {
          deviceComp.push({ isEqual: false, datto: dattoComputerNames[i], sophos: undefined });
        } else {
          break;
        }
      }
    }

    return (
      <div className="device-comp">
        {loadingSites && <Notify>Site list loading...</Notify>}
        <table className="device-comp-table">
          <thead>
            <tr>
              <th>Sophos Computers: {sophosCount}</th>
              <th>Datto Computers: {dattoCount}</th>
            </tr>
          </thead>
          <tbody>
            {deviceComp.map((comp) => {
              if (comp.isEqual) {
                return (
                  <tr className="device-comp-table-row-equal">
                    <td>{comp.sophos}</td>
                    <td>{comp.datto}</td>
                  </tr>
                )
              } else {
                return (
                  <tr className="device-comp-table-row-unequal">
                    <td>{comp.sophos ? comp.sophos : ""}</td>
                    <td>{comp.datto ? comp.datto : ""}</td>
                  </tr>
                )
              }
            })}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="app-wrapper">
      <div className="app-header">
        <h1>Centriserve API Tools</h1>
      </div>
      <div className="app-body">
        <select className="site-name-select" value={siteName} onChange={UpdateComputerCount}>
          {allSiteNames.map((siteName) => {
            return <option value={siteName}>{siteName}</option>
          })}
        </select>
        {GenerateComputerNames()}
      </div>
    </div>
  );
}

export default App;