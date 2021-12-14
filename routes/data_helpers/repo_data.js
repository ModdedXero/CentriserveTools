const fs = require("../../utilities/file_saver");
const uuid = require("uuid").v4;

async function GenerateFileTree() {
    if (await fs.IsFile("tree.index", fs.FileTypes.FileStore)) return;

    const fileTree = await fs.FileTree(fs.FileTypes.FileStore);
    const indexedTree = await indexBranch(fileTree, "");
    await fs.WriteFile("tree.index", JSON.stringify(indexedTree), fs.FileTypes.FileStore);
}

async function indexBranch(tree, path) {
    const indexedTree = {};

    for (const [key, value] of Object.entries(tree)) {
        indexedTree[key] = {};

        if (typeof(value) !== "string") {
            indexedTree[key].type = "dir";
            indexedTree[key].name = key;
            indexedTree[key].content = await indexBranch(value, path + "/" + key);
        } else if (key !== "tree.index") {
            indexedTree[key].type = "file";
            indexedTree[key].content = value;
            indexedTree[key].id = uuid();
            indexedTree[key].path = path;
        }
    }

    return indexedTree;
}

async function GetRepoFileTree() {
    await GenerateFileTree();
    return JSON.parse(await fs.ReadFile("tree.index", fs.FileTypes.FileStore));
}

async function DownloadFile(res, uuid) {
    const tree = JSON.parse(await fs.ReadFile("tree.index", fs.FileTypes.FileStore));
    const fPath = findFile(tree, uuid);

    if (fPath) {
        res.download(fs.FileTypes.FileStore + fPath, fPath.split("/")[-1])
    } else {
        res.json({ response: "Failed to find file" })
    }
}

function findFile(tree, uuid) {
    for (const key in tree) {
        const branch = tree[key];
        if (branch.type === "dir") {
            const test = findFile(branch.content, uuid);
            if (test) return test;
        } else if (branch.id === uuid) {
            return branch.path + "/" + branch.content;
        }
    }

    return undefined;
}

exports.GetRepoFileTree = GetRepoFileTree;
exports.DownloadFile = DownloadFile;