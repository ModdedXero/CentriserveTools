const router = require("express").Router();
const axios = require("axios");

let DattoAccessToken;

InitDattoAPI();

function InitDattoAPI() {
    axios.post(`${process.env.DATTO_API_URL}/auth/oauth/token`,
        `grant_type=password&username=${process.env.DATTO_CLIENT_KEY}&password=${process.env.DATTO_SECRET_KEY}`,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" }, auth: { username: "public-client", password: "public" }})
        .then(res => { DattoAccessToken = res.data.access_token })
        .catch(err => console.log(err))
}

router.route("/devicecount/:sitename").get(async (req, res) => {
    let tenants;
    let tenant;

    await axios.get(`${process.env.DATTO_API_URL}/api/v2/account/sites`, { headers: { Authorization: `Bearer ${DattoAccessToken}` }})
        .then(res => { tenants = res.data.sites })
        .catch(err => console.log(err))

    for (let i = 0; i < tenants.length; i++) {
        if (tenants[i].name.toLowerCase().includes(req.params.sitename.toLowerCase())) {
            tenant = tenants[i];
            break;
        }
    }

    await axios.get(`${process.env.DATTO_API_URL}/api/v2/site/${tenant.uid}`,
        { headers: { Authorization: `Bearer ${DattoAccessToken}` }})
        .then(doc => { res.status(200).json({ response: doc.data.devicesStatus.numberOfDevices }) })
        .catch(err => console.log(err))
});

router.route("/devices/:sitename").get(async (req, res) => {
    let tenants;
    let tenant;
    let deviceNames = [];

    await axios.get(`${process.env.DATTO_API_URL}/api/v2/account/sites`, { headers: { Authorization: `Bearer ${DattoAccessToken}` }})
        .then(doc => { tenants = doc.data.sites })
        .catch(err => console.log(err))

    for (let i = 0; i < tenants.length; i++) {
        if (tenants[i].name.toLowerCase().includes(req.params.sitename.toLowerCase())) {
            tenant = tenants[i];
            break;
        }
    }

    await axios.get(`${process.env.DATTO_API_URL}/api/v2/site/${tenant.uid}/devices`,
        { headers: { Authorization: `Bearer ${DattoAccessToken}` }})
        .then(doc => { tenant.devices = doc.data.devices })
        .catch(err => console.log(err))

    for (let i = 0; i < tenant.devices.length; i++) {
        deviceNames.push(tenant.devices[i].hostname.toUpperCase());
    }

    res.status(200).json({ response: deviceNames.sort((a, b) => a.localeCompare(b)) });
});

router.route("/sites").get(async (req, res) => {
    let tenants;
    let siteNames = [];

    await axios.get(`${process.env.DATTO_API_URL}/api/v2/account/sites`, { headers: { Authorization: `Bearer ${DattoAccessToken}` }})
        .then(doc => { tenants = doc.data.sites })
        .catch(err => console.log(err))

    if (!tenants) {
        res.status(302);
        return;
    }

    for (let i = 0; i < tenants.length; i++) {
        if (tenants[i].name) {
            siteNames.push(tenants[i].name);
        }
    }

    res.status(200).json({ response: siteNames });
});

module.exports = router;