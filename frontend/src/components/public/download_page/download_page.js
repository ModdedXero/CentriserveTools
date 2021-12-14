import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import fileDownload from "js-file-download";
import SearchBar from "../../utility/search_bar";

import Button from "../../utility/button";
import Modal from "../../utility/modal";

export default function DownloadPage() {
    const [fileTree, setFileTree] = useState([]);
    const [visibleTree, setVisibleTree] = useState([]);
    const [treePath, setTreePath] = useState([]);
    const [searchOptions, setSearchOptions] = useState([]);

    const [folderModal, setFolderModal] = useState(false);
    const [fileModal, setFileModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState({});
    const folderNameRef = useRef("");

    useEffect(() => {
        axios.get("/api/repo/file-tree")
            .then(res => {
                CreateFileTree(res.data.response);
            });
    }, [])

    function CreateFileTree(tree) {
        setFileTree(tree);
        setVisibleTree(getDescendantProp(tree, treePath));
        setSearchOptions(getSearchOptions(tree));
    }

    function getSearchOptions(tree) {
        let options = [];

        for (const [key, value] of Object.entries(tree)) {
            if (value.type === "dir") {
                options.push({
                    value: value.path,
                    label: key,
                    description: value.path,
                    icon: <i className="fas fa-folder" />
                })
                options = options.concat(getSearchOptions(value.content))
            } else {
                options.push({
                    value: value.path,
                    label: key,
                    description: value.path,
                    icon: <i className="fas fa-file" />
                })
            }
        }

        return options;
    }

    function NewFolder(e) {
        e.preventDefault();

        axios.post("/api/repo/new-folder", { path: treePath, folderName: folderNameRef.current.value })
            .then(_ => {
                axios.get("/api/repo/file-tree")
                    .then(res => {
                        CreateFileTree(res.data.response);
                    });

                setFolderModal(false);
            })
            .catch(err => console.log(err))
    }
    
    function UploadFile(e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("path", treePath)

        axios.post("/api/repo/upload-file", formData)
            .then(_ => {
                axios.get("/api/repo/file-tree")
                    .then(res => {
                        CreateFileTree(res.data.response);
                    });

                setFileModal(false);
            })
    }

    function OnFileChange(e) {
        setSelectedFile(e.target.files[0])
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

    function OnSearchChange(item) {
        const newTree = item.description.split("/").splice(1);
        setTreePath(newTree)
        console.log(newTree)
        setVisibleTree(getDescendantProp(fileTree, newTree))
    }

    return (
        <div className="app-body">
            <div className="download-page">
                <div className="file-tree-search">
                    <SearchBar 
                        options={searchOptions}
                        setValue={OnSearchChange}
                    />
                </div>
                <div className="file-tree-path">
                    <button onClick={_ => BrowsePath(-1)}>Downloads/</button>
                    {treePath.map((branch, index) => {
                        return (
                            <button onClick={_ => BrowsePath(index)}>{branch}/</button>
                        )
                    })}
                </div>

                {treePath.length > 0 && <div className="file-tree-buttons">
                    <Button onClick={_ => setFolderModal(!folderModal)}>
                        New Folder
                    </Button>
                    <Button onClick={_ => setFileModal(!fileModal)}>
                        Upload File
                    </Button>
                </div>}
                <Modal visible={folderModal} onClose={setFolderModal}>
                    <form className="modal-form" onSubmit={NewFolder}>
                        <label>Folder Name</label>
                        <input type="text" required minLength={4} ref={folderNameRef} />
                        <Button type="submit">Create Folder</Button>
                    </form>
                </Modal>
                <Modal visible={fileModal} onClose={setFileModal}>
                    <form className="modal-form" onSubmit={UploadFile}>
                        <input type="file" required onChange={OnFileChange} />
                        <Button type="submit">Upload</Button>
                    </form>
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
        </div>
    )
}