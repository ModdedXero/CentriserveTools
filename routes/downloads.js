const router = require("express").Router();
const Repo = require("./data_helpers/repo_data");

router.route("/repo/:id").get(async (req, res) => {
    Repo.DownloadFile(res, req.params.id);
});

module.exports = router;