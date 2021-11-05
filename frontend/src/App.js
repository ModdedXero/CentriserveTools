import React, { useState } from "react";
import axios from "axios";

function App() {
  const [sophosCount, setSophosCount] = useState(0);
  const [dattoCount, setDattoCount] = useState(0);

  async function UpdateComputerCount() {
    axios.get(`/api/sophos/devicecount/kuna kids dental`)
    .then(res => setSophosCount(res.data.response))

    axios.get(`/api/dattp/devicecount/kuna kids dental`)
  };

  return (
    <div>
      Sophos Computer Count {sophosCount}
      <br />
      Datto Computer Count {dattoCount}
      <br />
      <button onClick={UpdateComputerCount}>Update Count</button>
    </div>
  );
}

export default App;