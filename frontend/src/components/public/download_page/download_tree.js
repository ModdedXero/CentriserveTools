import React, { useEffect, useState } from "react";
import axios from "axios";
import fileDownload from "js-file-download";

import Button from "../../utility/button";
import Modal from "../../utility/modal";

export default function DownloadTree() {
    const [fileTree, setFileTree] = useState([]);
    const [visibleTree, setVisibleTree] = useState([]);
    const [treePath, setTreePath] = useState([]);

    useEffect(() => {
        axios.get("/api/repo/file-tree")
            .then(res => {
                setFileTree(res.data.response);
                setVisibleTree(res.data.response);
            });
    }, [])

    function NewFolder() {

    }
    
    function UploadFile() {

    }

    function BranchClick(branch) {
        if (branch.type === "dir") {
            treePath.push(branch.name);
            setVisibleTree(branch.content);
        } else {
            axios.get(`/downloads/repo/${branch.id}`)
                .then(res => {
                    let blob = new Blob(
                        [res.data]
                    );
                    
                    fileDownload(blob, `${branch.content}`);
                })
        }
    }

    function BrowsePath(index) {
        treePath.length = index + 1;
        setVisibleTree(getDescendantProp(fileTree, treePath));
    }

    function getDescendantProp(obj, array) {
        let target = obj;

        for (const prop of array) {
            target = target[prop].content;
        }

        return target ? target : undefined;
    }

    function LinkToClipboard(fileId) {
        navigator.clipboard.writeText(window.location.origin + `/downloads/repo/${fileId}`);
    }

    return (
        <div>
            <div className="file-tree-path">
                <button onClick={_ => BrowsePath(-1)}>Downloads/</button>
                {treePath.map((branch, index) => {
                    return (
                        <button onClick={_ => BrowsePath(index)}>{branch}/</button>
                    )
                })}
            </div>
            <div className="file-tree-buttons">
                <Button>
                    New Folder
                </Button>
                <Button>
                    Upload File
                </Button>
            </div>
            <Modal>

            </Modal>
            <Modal>
                
            </Modal>
            <ul className="file-tree">
                {Object.entries(visibleTree).map(([key, value]) => {
                    return (
                        <div>
                            <li 
                                onClick={_ => BranchClick(value)}
                            >
                                {value.type === "file" && <i className="fas fa-file"></i>}
                                {value.type === "dir" && <i className="far fa-folder"></i>}
                                {key}
                            </li>
                            {
                                value.type === "file" &&
                                <Button className="none" onClick={_ => LinkToClipboard(value.id)}>
                                    <i className="fas fa-link" />
                                </Button>
                            }
                        </div>
                    )
                })}
            </ul>
        </div>
    )
}