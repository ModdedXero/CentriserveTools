const router = require("express").Router();
const axios = require("axios");

const SophosClientKey = "3e87a2ab-0766-48db-a167-8e5344d06a4c"
const SophosSecretKey = "37bc07c18d70b70cb47cfc446888486bb2f4b85bba4d09a48525b7530fe33d2e3d002a325fce650fe17e8397009c957d9d0f"
const SophosApiURL = "https://api.central.sophos.com"

let SophosAccessToken;
let SophosOrgID;

InitSophosAPI();

async function InitSophosAPI() {
    await axios.post("https://id.sophos.com/api/v2/oauth2/token", 
        `grant_type=client_credentials&client_id=${SophosClientKey}&client_secret=${SophosSecretKey}&scope=token`)
        .then(res => { SophosAccessToken = res.data.access_token })
        .catch(err => console.log(err))

    await axios.get(`${SophosApiURL}/whoami/v1`,
        { headers: { Authorization: `Bearer ${SophosAccessToken}` }})
        .then(res => { SophosOrgID = res.data.id })
        .catch(err => console.log(err))
}

router.route("/devicecount/:sitename").get(async (req, res) => {
    let tenant;

    for (let i = 1; i < 10; i++) {
        if (tenant) { break; }

        await axios.get(`${SophosApiURL}/organization/v1/tenants?page=${i}`, 
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

        await axios.get(`${SophosApiURL}/organization/v1/tenants?page=${i}`, 
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
        computerNames.push(tenant.devices[i].hostname);
    }

    res.status(200).json({ response: computerNames })
});

module.exports = router;