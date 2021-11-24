const axios = require("axios");
const utilities = require("../../utilities");

// Initialize needed datto access tokens
let DattoAccessToken;
let APIInit = false;

InitDattoAPI();

// Use Client and Secret keys in config to obtain API Access Token
async function InitDattoAPI() {
    let APICount = 0;
    while (true) {
        await axios.post(`${process.env.DATTO_API_URL}/auth/oauth/token`,
            `grant_type=password&username=${process.env.DATTO_CLIENT_KEY}&password=${process.env.DATTO_SECRET_KEY}`,
            { headers: { "Content-Type": "application/x-www-form-urlencoded" }, auth: { username: "public-client", password: "public" }})
            .then(res => { DattoAccessToken = res.data.access_token; APICount++; })
            .catch(err => console.log("Failed to retrieve Datto Access Token!"))        

        if (APICount >= 1) {
            console.log("Datto API Enabled!");
            break;
        }
    }

    APIInit = true;
}

// Access Datto API for array of devices based off a Site Name and returns array
async function GetDevices(siteName) {
    await utilities.waitFor(() => APIInit === true);
    
    let tenants;
    let tenant;
    let deviceInfo = [];

    await axios.get(`${process.env.DATTO_API_URL}/api/v2/account/sites`, { headers: { Authorization: `Bearer ${DattoAccessToken}` }})
        .then(doc => { tenants = doc.data.sites })
        .catch(err => console.log("Failed to retrieve Datto Sites!"))

    for (let i = 0; i < tenants.length; i++) {
        if (tenants[i].name.toLowerCase().replace(/ /g, "") == siteName.toLowerCase().replace(/ /g, "")) {
            tenant = tenants[i];
            break;
        }
    }

    if (!tenant) {
        return undefined;
    }

    await axios.get(`${process.env.DATTO_API_URL}/api/v2/site/${tenant.uid}/devices`,
        { headers: { Authorization: `Bearer ${DattoAccessToken}` }})
        .then(doc => { tenant.devices = doc.data.devices })
        .catch(err => console.log("Failed to retrieve Datto Devices!"))

    for (let i = 0; i < (tenant.devices ? tenant.devices.length : 0); i++) {
        tenant.devices[i].hostname = tenant.devices[i].hostname.toUpperCase();
        deviceInfo.push(tenant.devices[i]);
    }

    return deviceInfo.sort((a, b) => a.hostname.localeCompare(b.hostname));
}

// Access Datto API for array of sites and returns array
async function GetSites() {
    await utilities.waitFor(() => APIInit === true);

    let tenants;
    let siteNames = [];

    await axios.get(`${process.env.DATTO_API_URL}/api/v2/account/sites`, { headers: { Authorization: `Bearer ${DattoAccessToken}` }})
        .then(doc => { tenants = doc.data.sites })
        .catch(err => console.log("Failed to retrieve Datto Sites!"))

    if (!tenants) {
        res.status(302);
        return;
    }

    for (let i = 0; i < tenants.length; i++) {
        if (tenants[i].name) {
            siteNames.push(tenants[i].name);
        }
    }

    return siteNames;
}

exports.GetDevices = GetDevices;
exports.GetSites = GetSites;