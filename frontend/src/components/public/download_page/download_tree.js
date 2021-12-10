import React, { useEffect, useState } from "react";
import axios from "axios";

export default function DownloadTree() {
    const [fileTree, setFileTree] = useState([]);
    const [visibleTree, setVisibleTree] = useState([]);

    useEffect(() => {
        axios.get("/api/repo/filetree")
            .then(res => setFileTree(res.data.response));
    }, [])

    return (
        <table className="file-tree">
            <tr>
                <td>

                </td>
            </tr>
        </table>
    )
}