const router = require("express").Router();
const axios = require("axios");

const DattoClientKey = "5A41K8RAHBVI7JKVR11RQF3J4Q1NBNC0";
const DattoSecretKey = "7G2J5GSO4KLF78JOI22NKBFMAAK5PDD1";
const DattoApiURL = "https://zinfandel-api.centrastage.net";

let DattoAccessToken;

InitDattoAPI();

function InitDattoAPI() {
    axios.post(`${DattoApiURL}/auth/oauth/token`,
        `grant_type=password&username=${DattoClientKey}&password=${DattoSecretKey}`,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" }, auth: { username: "public-client", password: "public" }})
        .then(res => { DattoAccessToken = res.data.access_token })
        .catch(err => console.log(err))
}

router.route("/devicecount/:sitename").get(async (req, res) => {
    let tenants;
    let tenant;

    await axios.get(`${DattoApiURL}/api/v2/account/sites`, { headers: { Authorization: `Bearer ${DattoAccessToken}` }})
        .then(res => { tenants = res.data.sites })
        .catch(err => console.log(err))

    for (let i = 0; i < tenants.length; i++) {
        if (tenants[i].name.toLowerCase().includes(req.params.sitename.toLowerCase())) {
            tenant = tenants[i];
            break;
        }
    }

    await axios.get(`${DattoApiURL}/api/v2/site/${tenant.uid}`,
        { headers: { Authorization: `Bearer ${DattoAccessToken}` }})
        .then(doc => { res.status(200).json({ response: doc.data.devicesStatus.numberOfDevices }) })
        .catch(err => console.log(err))
});

router.route("/devices/:sitename").get(async (req, res) => {
    let tenants;
    let tenant;
    let deviceNames = [];

    await axios.get(`${DattoApiURL}/api/v2/account/sites`, { headers: { Authorization: `Bearer ${DattoAccessToken}` }})
        .then(doc => { tenants = doc.data.sites })
        .catch(err => console.log(err))

    for (let i = 0; i < tenants.length; i++) {
        if (tenants[i].name.toLowerCase().includes(req.params.sitename.toLowerCase())) {
            tenant = tenants[i];
            break;
        }
    }

    await axios.get(`${DattoApiURL}/api/v2/site/${tenant.uid}/devices`,
        { headers: { Authorization: `Bearer ${DattoAccessToken}` }})
        .then(doc => { tenant.devices = doc.data.devices })
        .catch(err => console.log(err))

    for (let i = 0; i < tenant.devices.length; i++) {
        deviceNames.push(tenant.devices[i].hostname);
    }

    res.status(200).json({ response: deviceNames });
});

module.exports = router;