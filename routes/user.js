const router = require("express").Router();

const auth = require("../database/auth");

router.route("/login").post(async (req, res) => {
    await auth.ValidateLogin(req.body.username, req.body.password ? req.body.password : "")
            .then(usr => {
                res.status(200).json({
                    response: "authenticated",
                    token: {
                        username: req.body.username,
                        auth: "approved",
                        encrypt: usr[0],
                        security: usr[1]
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

router.route("/register").post(async (req, res) => {
    const result = await auth.SavePassword(req.body.username, req.body.password);

    if (result) {
        await auth.ValidateLogin(req.body.username, req.body.password)
                .then(usr => {
                    res.status(200).json({
                        response: "authenticated",
                        token: {
                            username: req.body.username,
                            auth: "approved",
                            encrypt: usr[0],
                            security: usr[1]
                        }
                    })
                })
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
});

router.route("/all").get(async (req, res) => {
    const users = await auth.GetAllUsers();
    res.status(200).json({ response: users })
});

router.route("/resetpassword").post(async (req, res) => {
    result = await auth.ResetPassword(req.body.username);

    if (result) res.status(200).json({ response: "Password reset!" })
    else res.json({ response: "Failed to reset password!" })
});

router.route("/update").post(async (req, res) => {
    const result = await auth.UpdateUser(req.body.data);

    if (result) res.status(200).json({ response: "User updated!" });
    else res.json({ response: "User not updated!" });
});

router.route("/create").post(async (req, res) => {
    const result = await auth.CreateUser(req.body.username, req.body.security);

    if (result) {
        res.status(200).json({ response: "User Created!" });
    } else {
        res.json({ response: "User not created!" });
    }
});

router.route("/delete").delete(async (req, res) => {
    const result = await auth.DeleteUser(req.body.username);

    if (result) res.status(200).json({ response: "User deleted!" });
    else res.json({ response: "Failed to delete user!" });
});

module.exports = router;