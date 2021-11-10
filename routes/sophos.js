const router = require("express").Router();
const axios = require("axios");

let SophosAccessToken;
let SophosOrgID;

InitSophosAPI();

async function InitSophosAPI() {
    await axios.post("https://id.sophos.com/api/v2/oauth2/token", 
        `grant_type=client_credentials&client_id=${process.env.SOPHOS_CLIENT_KEY}&client_secret=${process.env.SOPHOS_SECRET_KEY}&scope=token`)
        .then(res => { SophosAccessToken = res.data.access_token })
        .catch(err => console.log(err))

    await axios.get(`${process.env.SOPHOS_API_URL}/whoami/v1`,
        { headers: { Authorization: `Bearer ${SophosAccessToken}` }})
        .then(res => { SophosOrgID = res.data.id })
        .catch(err => console.log(err))
}

router.route("/devicecount/:sitename").get(async (req, res) => {
    let tenant;

    for (let i = 1; i < 10; i++) {
        if (tenant) { break; }

        await axios.get(`${process.env.SOPHOS_API_URL}/organization/v1/tenants?page=${i}`, 
            { headers: { Authorization: `Bearer ${SophosAccessToken}`, "X-Organization-ID": SophosOrgID }})
            .then(res => {
                for (let j = 0; j < res.data.items.length; j++) {
                    if (res.data.items[j].name.toLowerCase().includes(req.params.sitename.toLowerCase().replace("%20", " "))) {
                        tenant = res.data.items[j];
                        break;
                    }
                }
            })
    }
    
    await axios.get(`${tenant.apiHost}/endpoint/v1/endpoints`, 
        { headers: { Authorization: `Bearer ${SophosAccessToken}`, "X-Tenant-ID": tenant.id }})
        .then(res => { tenant.devices = res.data.items })

    res.status(200).json({ response: tenant.devices.length });
});

router.route("/devices/:sitename").get(async (req, res) => {
    let tenant;
    let computerNames = [];

    for (let i = 1; i < 10; i++) {
        if (tenant) { break; }

        await axios.get(`${process.env.SOPHOS_API_URL}/organization/v1/tenants?page=${i}`, 
            { headers: { Authorization: `Bearer ${SophosAccessToken}`, "X-Organization-ID": SophosOrgID }})
            .then(res => {
                for (let j = 0; j < res.data.items.length; j++) {
                    if (res.data.items[j].name.toLowerCase().includes(req.params.sitename.toLowerCase().replace("%20", " "))) {
                        tenant = res.data.items[j];
                        break;
                    }
                }
            })
    }

    await axios.get(`${tenant.apiHost}/endpoint/v1/endpoints`, 
        { headers: { Authorization: `Bearer ${SophosAccessToken}`, "X-Tenant-ID": tenant.id }})
        .then(res => { tenant.devices = res.data.items })

    for (let i = 0; i < tenant.devices.length; i++) {
        computerNames.push(tenant.devices[i].hostname.toUpperCase());
    }

    res.status(200).json({ response: computerNames.sort((a, b) => a.localeCompare(b)) })
});

router.route("/sites").get(async (req, res) => {
    let tenants = [];
    let sites = [];

    for (let i = 1; i < 10; i++) {
        await axios.get(`${process.env.SOPHOS_API_URL}/organization/v1/tenants?page=${i}`, 
            { headers: { Authorization: `Bearer ${SophosAccessToken}`, "X-Organization-ID": SophosOrgID }})
            .then(res => { tenants.push(res.data.items) })
    }

    for (let i = 0; i < tenants.length; i++) {
        if (tenants[i]) {
            for (let j = 0; j < tenants[i].length; j++) {
                if (tenants[i][j].name && !tenants[i][j].name.includes("ZZZ") && !tenants[i][j].name.includes("XX")) {
                    sites.push(tenants[i][j].name);
                }
            }
        }
    }

    res.status(200).json({ response: sites.sort((a, b) => a.localeCompare(b)) });
});

module.exports = router;