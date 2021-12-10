import React, { useEffect, useState } from "react";
import axios from "axios";

import DownloadTree from "./download_tree";

export default function DownloadPage() {
    function OpenFile(file) {

    }

    return (
        <div className="app-body">
            <div className="download-page">
                <DownloadTree openFile={OpenFile} />
            </div>
        </div>
    )
}