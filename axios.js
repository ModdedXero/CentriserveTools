const _axios = require("axios");
const arl = require("axios-rate-limit");

const axios = arl(_axios.create(), { maxRequests: 5, perMilliseconds: 500 });

module.exports = axios;