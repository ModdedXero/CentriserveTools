import React, { useState } from "react";
import axios from "axios";

function App() {
  const [sophosCount, setSophosCount] = useState(0);
  const [dattoCount, setDattoCount] = useState(0);
  const [sophosComputerNames, setSophosComputerNames] = useState([]);
  const [dattoComputerNames, setDattoComputerNames] = useState([]);
  const [siteName, setSiteName] = useState("");

  async function UpdateComputerCount() {
    setSophosCount(0);
    setDattoCount(0);
    setSophosComputerNames([]);
    setDattoComputerNames([]);

    axios.get(`/api/sophos/devicecount/${siteName}`)
    .then(res => setSophosCount(res.data.response))

    axios.get(`/api/datto/devicecount/${siteName}`)
      .then(res => setDattoCount(res.data.response))

    axios.get(`/api/sophos/devices/${siteName}`)
      .then(res => setSophosComputerNames(res.data.response.sort()))

    axios.get(`/api/datto/devices/${siteName}`)
      .then(res => setDattoComputerNames(res.data.response.sort()))
  };

  function GenerateComputerNames() {
    return (
      <div>
        <div>
          <h3>Sophos Computers</h3>
          {sophosComputerNames.map((device) => {
            return (
              <p>
                {device}
              </p>
            )
          })}
        </div>
        <div>
          <h3>Datto Computers</h3>
            {dattoComputerNames.map((device) => {
              return (
                <p>
                  {device}
                </p>
              )
            })}
        </div>
      </div>
    )
  }

  return (
    <div>
      <input type="text" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
      <br />
      <button onClick={UpdateComputerCount}>Update Count</button>
      <br />
      Sophos Computer Count {sophosCount}
      <br />
      Datto Computer Count {dattoCount}
      {GenerateComputerNames()}
    </div>
  );
}

export default App;