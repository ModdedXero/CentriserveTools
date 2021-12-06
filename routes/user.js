const router = require("express").Router();

const auth = require("../database/auth");

router.route("/login").post(async (req, res) => {
    await auth.ValidateLogin(req.body.username, req.body.password ? req.body.password : "")
            .then(encrypt => {
                res.status(200).json({
                    response: "authenticated",
                    token: {
                        username: req.body.username,
                        auth: "approved",
                        encrypt: encrypt
                    }
                })
            })
            .catch(code => {
                if (code === 3) {
                    res.json({ response: "bad_password" });
                } else if (code === 2) {
                    res.json({ response: "create_password" });
                } else if (code === 0) {
                    res.json({ response: "not_authenticated" });
                } else {
                    res.json({ response: "not_authenticated" });
                }
            })
});

router.route("/password").post(async (req, res) => {
    const result = await auth.SavePassword(req.body.username, req.body.password);

    if (result) {
        res.status(200).json({ response: "password_saved", token: { username: req.body.username, auth: "approved" }});
    } else {
        res.status(200).json({ response: "password_notsaved" });
    }
});

router.route("/2fahash").post(async (req, res) => {
    const result = await auth.ValidateEncryptionKey(req.body.username, req.body.hash);

    if (result) {
        res.status(200).json({ response: "authenticated" });
    } else {
        res.json({ response: "failure" });
    }
})

module.exports = router;