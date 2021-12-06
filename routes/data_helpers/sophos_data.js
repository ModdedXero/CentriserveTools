// Initialize required packages (express: Server router, axios: http API)
const axios = require("axios");

const fs = require("../../utilities/file_saver");
const waitFor = require("../../utilities/wait_for");

// Initialize needed sophos access tokens
let SophosAccessToken;
let SophosPartnerID;
let APIInit = false;

InitSophosAPI();

// Use Client and Secret keys in config to obtain API Access Token
async function InitSophosAPI() {
    APIInit = false;
    
    while (true) {
        SophosAccessToken = "";
        SophosPartnerID = "";

        let APICount = 0;
        await new Promise(resolve => setTimeout(resolve, 1500));

        await axios.post("https://id.sophos.com/api/v2/oauth2/token", 
            `grant_type=client_credentials&client_id=${process.env.SOPHOS_CLIENT_KEY}&client_secret=${process.env.SOPHOS_SECRET_KEY}&scope=token`)
            .then(doc => { SophosAccessToken = doc.data.access_token; APICount++; })
            .catch(err => { console.log("Failed to retrieve Sophos Access Token!") })

        if (SophosAccessToken) {
            await axios.get(`${process.env.SOPHOS_API_URL}/whoami/v1`,
                { headers: { Authorization: `Bearer ${SophosAccessToken}` }})
                .then(doc => { SophosPartnerID = doc.data.id; APICount++; })
                .catch(err => { console.log("Failed to retrieve Sophos Partner ID!") })
        }

        if (APICount >= 2) {
            console.log("Sophos API Enabled!");
            break;
        };
    }

    APIInit = true;
}

// Access Sophos API for array of devices based off a Site Name and returns array
async function GetDevices(id) {
    await waitFor(() => APICheck());

    let tenant;
    let deviceInfo = [];

    await axios.get(`${process.env.SOPHOS_API_URL}/partner/v1/tenants/${id}`, 
        { headers: { Authorization: `Bearer ${SophosAccessToken}`, "X-Partner-ID": SophosPartnerID }})
        .then(doc => { tenant = doc.data })
        .catch(err => APICheck("Failed to retrieve Sophos Tenant!"))

    if (!tenant) return [];
    await axios.get(`${tenant.apiHost}/endpoint/v1/endpoints?view=full`, 
        { headers: { Authorization: `Bearer ${SophosAccessToken}`, "X-Tenant-ID": tenant.id }})
        .then(doc => { tenant.devices = doc.data.items })
        .catch(err => APICheck("Failed to retrieve Sophos Devices!"))

    for (let i = 0; i < (tenant.devices ? tenant.devices.length : 0); i++) {
        tenant.devices[i].hostname = tenant.devices[i].hostname.toUpperCase().substring(0, 15);
        deviceInfo.push(tenant.devices[i]);
    }

    return deviceInfo.sort((a, b) => a.hostname.localeCompare(b.hostname));
}

async function EnableTamper(id, tenantId) {
    let result = false;
    let tenant;

    await axios.get(`${process.env.SOPHOS_API_URL}/partner/v1/tenants/${tenantId}`, 
        { headers: { Authorization: `Bearer ${SophosAccessToken}`, "X-Partner-ID": SophosPartnerID }})
        .then(doc => { tenant = doc.data })
        .catch(err => APICheck("Failed to retrieve Sophos Tenant!"))

    await axios.post(`${tenant.apiHost}/endpoint/v1/endpoints/${id}/tamper-protection`, { "enabled": true, "regeneratePassword": false },
        { headers: { Authorization: `Bearer ${SophosAccessToken}`, "X-Tenant-ID": tenant.id }})
        .then(result = true)
        .catch(APICheck("Failed to enable Tamper Protection!"))

    return result;
}

// Access Sophos API for array of sites and returns array
async function GetSites() {
    await waitFor(() => APICheck());

    if (await fs.IsFile("sites.txt", fs.FileTypes.Agents)) {
        if ((await fs.ModifiedDate("sites.txt", fs.FileTypes.Agents) - Date.now()) < 60 * 60 * 1000)
        return JSON.parse(await fs.ReadFile("sites.txt", fs.FileTypes.Agents)).sites;
    }
    
    let tenants = [];
    let sites = [];

    await axios.get(`${process.env.SOPHOS_API_URL}/partner/v1/tenants?page=1&pageSize=100&pageTotal=true`, 
        { headers: { Authorization: `Bearer ${SophosAccessToken}`, "X-Partner-ID": SophosPartnerID }})
        .then(async doc => {
            for (let i = 1; i < doc.data.pages.total; i++) {
                await axios.get(`${process.env.SOPHOS_API_URL}/partner/v1/tenants?page=${i}&pageSize=100&pageTotal=true`, 
                { headers: { Authorization: `Bearer ${SophosAccessToken}`, "X-Partner-ID": SophosPartnerID }})
                    .then(doc => { tenants.push(doc.data.items) })
                    .catch(err => APICheck("Failed to get sites!"));
            }
        })
        .catch(err => console.log(err))

    for (let i = 0; i < tenants.length; i++) {
        if (tenants[i]) {
            for (let j = 0; j < tenants[i].length; j++) {
                if (tenants[i][j].name && !tenants[i][j].name.includes("ZZZ") && !tenants[i][j].name.includes("XX") && !tenants[i][j].name.includes("null")) {
                    sites.push(tenants[i][j]);
                }
            }
        }
    }
    
    sites.sort((a, b) => a.name.localeCompare(b.name));
    sitesUniq = sites.filter((item, pos, self) => {
        if (self[pos + 1]) {
            return self[pos].name != self[pos + 1].name;
        } else {
            return true;
        }
    })

    fs.WriteFile("sites.txt", JSON.stringify({ sites: sitesUniq }), fs.FileTypes.Agents);
    return sitesUniq;
}

/* Helper Function */

async function APICheck(error) {
    if (error && APIInit) {
        console.log(error);

        await InitSophosAPI();
    }

    return APIInit;
}

exports.GetDevices = GetDevices;
exports.EnableTamper = EnableTamper;
exports.GetSites = GetSites;