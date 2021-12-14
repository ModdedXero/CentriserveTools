const router = require("express").Router();
const Repo = require("./data_helpers/repo_data");

router.route("/file-tree").get(async (req, res) => {
    const result = await Repo.GetRepoFileTree();
    res.status(200).json({ response: result });
});

router.route("/download/:id").get(async (req, res) => {
    Repo.DownloadFile(res, req.params.id);
});

router.route("/upload-file").post(async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send("No Files were uploaded");
    }

    let file = req.files.file;
    const result = await Repo.SaveFile(file, req.body.path);

    if (result) {
        res.status(200).send("File saved!");
    } else {
        res.status(400).send("Files failed to save!")
    }
});

router.route("/new-folder").post(async (req, res) => {
    const result = await Repo.CreateFolder(req.body.folderName, req.body.path);

    if (!result) {
        res.status(200).send("Folder created!");
    } else {
        res.status(400).send("Folder failed to save!");
    }
});

router.route("/reindex").get(async (req, res) => {
    Repo.GenerateFileTree(true);
    res.status(200).send("Repo reindexed!");
})

module.exports = router;