import React, { useState } from "react";
import axios from "axios";

function App() {
  const [sophosCount, setSophosCount] = useState(0);
  const [dattoCount, setDattoCount] = useState(0);
  const [siteName, setSiteName] = useState("");

  async function UpdateComputerCount() {
    setSophosCount(0);
    setDattoCount(0);

    axios.get(`/api/sophos/devicecount/${siteName}`)
    .then(res => setSophosCount(res.data.response))

    axios.get(`/api/datto/devicecount/${siteName}`)
      .then(res => setDattoCount(res.data.response))
  };

  return (
    <div>
      <input type="text" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
      <br />
      Sophos Computer Count {sophosCount}
      <br />
      Datto Computer Count {dattoCount}
      <br />
      <button onClick={UpdateComputerCount}>Update Count</button>
    </div>
  );
}

export default App;