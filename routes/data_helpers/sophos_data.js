// Initialize required packages (express: Server router, axios: http API)
const axios = require("axios");

// Initialize needed sophos access tokens
let SophosAccessToken;
let SophosPartnerID;

InitSophosAPI();

// Use Client and Secret keys in config to obtain API Access Token
async function InitSophosAPI() {
    await axios.post("https://id.sophos.com/api/v2/oauth2/token", 
        `grant_type=client_credentials&client_id=${process.env.SOPHOS_CLIENT_KEY}&client_secret=${process.env.SOPHOS_SECRET_KEY}&scope=token`)
        .then(doc => { SophosAccessToken = doc.data.access_token })
        .catch(err => console.log(err))

    await axios.get(`${process.env.SOPHOS_API_URL}/whoami/v1`,
        { headers: { Authorization: `Bearer ${SophosAccessToken}` }})
        .then(doc => { SophosPartnerID = doc.data.id })
        .catch(err => console.log(err))
}

// Access Sophos API for array of devices based off a Site Name and returns array
async function GetDevices(siteName) {
    let tenant;
    let computerNames = [];

    for (let i = 1; i < 10; i++) {
        if (tenant) { break; }

        await axios.get(`${process.env.SOPHOS_API_URL}/partner/v1/tenants?page=${i}`, 
            { headers: { Authorization: `Bearer ${SophosAccessToken}`, "X-Partner-ID": SophosPartnerID }})
            .then(doc => {
                for (let j = 0; j < doc.data.items.length; j++) {
                    if (doc.data.items[j].name.toLowerCase().includes(siteName.toLowerCase().replace("%20", " "))) {
                        tenant = doc.data.items[j];
                        break;
                    }
                }
            })
    }

    await axios.get(`${tenant.apiHost}/endpoint/v1/endpoints`, 
        { headers: { Authorization: `Bearer ${SophosAccessToken}`, "X-Tenant-ID": tenant.id }})
        .then(doc => { tenant.devices = doc.data.items })
        .catch(err => { return undefined })

    for (let i = 0; i < tenant.devices.length; i++) {
        computerNames.push(tenant.devices[i].hostname.toUpperCase());
    }

    return computerNames.sort((a, b) => a.localeCompare(b));
}

// Access Sophos API for array of sites and returns array
async function GetSites() {
    let tenants = [];
    let sites = [];

    for (let i = 1; i < 10; i++) {
        await axios.get(`${process.env.SOPHOS_API_URL}/partner/v1/tenants?page=${i}`, 
            { headers: { Authorization: `Bearer ${SophosAccessToken}`, "X-Partner-ID": SophosPartnerID }})
            .then(doc => { tenants.push(doc.data.items) })
            .catch(err => console.log(err))
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

    return sites.sort((a, b) => a.localeCompare(b));
}

exports.GetDevices = GetDevices
exports.GetSites = GetSites;