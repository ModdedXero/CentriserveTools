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
    
});

router.route("/new-folder").post(async (req, res) => {

});

module.exports = router;