const router = require("express").Router();

const auth = require("../database/auth");

router.route("/login").post(async (req, res) => {
    const result = await auth.ValidateLogin(req.body.username, req.body.password ? req.body.password : "");
    switch (result) {
        case 3:
            res.status(200).json({ response: "bad_password" });
            break;
        case 2:
            res.status(200).json({ response: "create_password" });
            break;
        case 1:
            res.status(200).json({ response: "authenticated", token: { username: req.body.username, auth: "approved" } });
            break;
        case 0:
            res.status(200).json({ response: "not_authenticated" });
            break;
        default:
            res.status(200).json({ response: "not_authenticated" });
    }
});

router.route("/password").post(async (req, res) => {
    const result = await auth.SavePassword(req.body.username, req.body.password);

    if (result) {
        res.status(200).json({ response: "password_saved", token: { username: req.body.username, auth: "approved" }});
    } else {
        res.status(200).json({ response: "password_notsaved" });
    }
});

module.exports = router;