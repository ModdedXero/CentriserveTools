const router = require("express").Router();
const Repo = require("./data_helpers/repo_data");

router.route("/filetree").get(async (req, res) => {
    const result = await Repo.GetRepoFileTree();

    res.status(200),json({ response: result });
});

module.exports = router;