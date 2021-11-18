// Initialize required packages (express: Server router, axios: http API)
const router = require("express").Router();

const SophosData = require("./data_helpers/sophos_data");

/* HTTP Request Routes */

// Access Sophos API for array of devices based off a Site Name and returns device count
router.route("/devicecount/:sitename").get(async (req, res) => {
    const devices = await SophosData.GetDevices(req.params.sitename);
    if (!devices) {
        res.status(302).json({ response: `Tenant ${siteName} not found!` });
    } else {
        res.status(200).json({ response: devices.length });
    }
});

// Access Sophos API for array of devices based off a Site Name and returns array
router.route("/devices/:sitename").get(async (req, res) => {
    const devices = await SophosData.GetDevices(req.params.sitename);
    if (!devices) {
        res.status(302).json({ response: `Tenant ${siteName} not found!` });
    } else {
        res.status(200).json({ response: devices });
    }
});

// Access Sophos API for array of sites and returns array
router.route("/sites").get(async (req, res) => {
    const siteNames = await SophosData.GetSites();
    res.status(200).json({ response: siteNames });
});

module.exports = router;