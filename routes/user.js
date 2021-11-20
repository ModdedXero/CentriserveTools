const router = require("express").Router();
const cookies = require("cookie-parser");

const mongo = require("../database/mongo");

router.route("/login").post(async (req, res) => {
    const options = {
        httpOnly: true,
        signed: true
    }

    const result = await mongo.ValidateLogin(req.body.username, req.body.password ? req.body.password : "");
    switch (result) {
        case 3:
            res.status(200).json({ response: "bad_password" });
            break;
        case 2:
            res.status(200).json({ response: "create_password"});
            break;
        case 1:
            res.status(200).json({ response: "authenticated" });
            break;
        case 0:
            res.status(401).json({ response: "not_authenticated" });
            break;
        default:
            res.status(401).json({ response: "not_authenticated" });
    }
});

router.route("/password").post(async (req, res) => {
    const result = await mongo.SavePassword(req.body.username, req.body.password);
    if (result) {
        res.status(200).json({ response: "password_saved" });
    } else {
        res.status(200).json({ response: "password_notsaved" });
    }
});

module.exports = router;