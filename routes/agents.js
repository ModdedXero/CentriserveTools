// This route is to replace frontend from calling Sophos and Datto seperately

// Initialize required packages (express: Server router, axios: http API, ExcelJS: Excel buffer generator)
const router = require("express").Router();

const DattoData = require("./data_helpers/datto_data");
const SophosData = require("./data_helpers/sophos_data");
const ReportGenerator = require("../reports/report_generator");

/* HTTP Request Routes */

// Gets Sophos and Datto devices and creates comparison and returns JSON object
router.route("/devices/:sitename").get(async (req, res) => {
  const dattoDevices = await DattoData.GetDevices(req.params.sitename);
  const sophosDevices = await SophosData.GetDevices(req.params.sitename);

  res.status(200).json({ response: {
    dattoCount: dattoDevices.length,
    sophosCount: sophosDevices.length,
    comparison: GenerateComputerList(dattoDevices, sophosDevices)
  }});
});

// Gets all customer sites and returns array
router.route("/sites").get(async (req, res) => {
  const siteNames = await SophosData.GetSites();
  res.status(200).json({ response: siteNames });
});

// Generates an excel report of all sites devices
router.route("/report/site/all").get(async (req, res) => {
  ReportGenerator.DownloadReport(res, "All Sites Agent Comparison");
});

// Generates an excel report of a specific sites devices
router.route("/report/site/:sitename").get(async (req, res) => {
  const wb = await ReportGenerator.GenSiteAgentComparison(req.params.sitename);
  wb.xlsx.write(res);
});

/* General Functions */

// Method for comparing string alphabetical order
function strcmp(a, b) {
    if (a === b) return 0;
    if (a > b) return 1;
    return -1;
}

// Filters Datto and Sophos device arrays into comparison
function GenerateComputerList(dattoDevices, sophosDevices) {
    const length = sophosDevices.length + dattoDevices.length;
    let deviceList = [];

    for (let i = 0; i < length; i++) {
      if (sophosDevices[i] && dattoDevices[i]) {
        switch (strcmp(sophosDevices[i].hostname, dattoDevices[i].hostname)) {
          case 0: 
            deviceList.push({ isEqual: true, datto: dattoDevices[i], sophos: sophosDevices[i] });
            break;
          case -1:
            dattoDevices.splice(i, 0, "");
            deviceList.push({ isEqual: false, datto: "", sophos: sophosDevices[i] });
            break;
          case 1:
            sophosDevices.splice(i, 0, "")
            deviceList.push({ isEqual: false, datto: dattoDevices[i], sophos: "" });
            break;
          default:
            console.log("Error sorting devices!");
        }
      } else {
        if (sophosDevices[i] && !dattoDevices[i]) {
          deviceList.push({ isEqual: false, datto: "", sophos: sophosDevices[i] });
        } else if (!sophosDevices[i] && dattoDevices[i]) {
          deviceList.push({ isEqual: false, datto: dattoDevices[i], sophos: "" });
        } else {
          return deviceList;
        }
      }
    }

    return deviceList;
}

module.exports = router;