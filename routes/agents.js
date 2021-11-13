// This route is to replace frontend from calling Sophos and Datto seperately

// Initialize required packages (express: Server router, axios: http API, ExcelJS: Excel buffer generator)
const router = require("express").Router();
const axios = require("axios");
const ExcelJS = require("exceljs");

// Local server URL for inverted API calls
const localUrl = `http://127.0.0.1:${process.env.PORT || 5000}`;

/* HTTP Request Routes */

// Gets Sophos and Datto devices and creates comparison and returns JSON object
router.route("/devices/:sitename").get(async (req, res) => {
  let dattoDevices = [];
  let sophosDevices = [];

  await GetSiteDevices(req.params.sitename)
    .then(res => { dattoDevices = res.datto; sophosDevices = res.sophos });

  res.status(200).json({ response: {
    dattoCount: dattoDevices.length,
    sophosCount: sophosDevices.length,
    comparison: GenerateComputerList(dattoDevices, sophosDevices)
  }});
});

// Gets all customer sites and returns array
router.route("/sites").get(async (req, res) => {

});

// Generates an excel report of a specific sites devices
router.route("/report/:sitename").get(async (req, res) => {
    const workbook = new ExcelJS.Workbook();
    
    let dattoDevices = [];
    let sophosDevices = [];
    let deviceCompList = [];

    const sheet = workbook.addWorksheet(req.params.sitename);
    sheet.columns = [
        { header: "Sophos", key: "sophos", width: 30 }, 
        { header: "Datto", key: "datto", width: 30}
    ];

    await axios.get(`${localUrl}/api/datto/devices/${req.params.sitename}`)
        .then(doc => { dattoDevices = doc.data.response })
    await axios.get(`${localUrl}/api/sophos/devices/${req.params.sitename}`)
        .then(doc => { sophosDevices = doc.data.response })

    deviceCompList = GenerateComputerList(dattoDevices, sophosDevices);

    deviceCompList.forEach((val) => {
        sheet.addRow({ sophos: val.sophos, datto: val.datto });
    })

    for (let i = 0; i < deviceCompList.length; i++) {
        if (deviceCompList[i].isEqual) {
            sheet.getCell(`A${i + 2}`).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "BAE7B5"} };
            sheet.getCell(`B${i + 2}`).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "BAE7B5"} };
        } else {
            sheet.getCell(`A${i + 2}`).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "DDB0B1"} };
            sheet.getCell(`B${i + 2}`).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "DDB0B1"} };
        }
    }

    workbook.xlsx.write(res);
});

// Generates an excel report of all sites devices
router.route("/reportall").get(async (req, res) => {
  const workbook = new ExcelJS.Workbook();
  let sites = [];

  await axios.get(`${localUrl}/api/sophos/sites`)
    .then(doc => { sites = doc.data.response })

  sitesUniq = [...new Set(sites)];
  let promise = Promise.resolve();

  sitesUniq.forEach(async (siteName) => {
    promise = promise.then(async () => {
      console.log(`${sitesUniq.indexOf(siteName)}/${sitesUniq.length}`);

      const sheet = workbook.addWorksheet(siteName.substring(0, 30));
      sheet.columns = [
          { header: "Sophos", key: "sophos", width: 30 }, 
          { header: "Datto", key: "datto", width: 30}
      ];

      let dattoDevices = [];
      let sophosDevices = [];

      await GetSiteDevices(siteName)
        .then(res => { dattoDevices = res.datto; sophosDevices = res.sophos });

      let deviceCompList = GenerateComputerList(dattoDevices, sophosDevices);
  
      deviceCompList.forEach((val) => {
          sheet.addRow({ sophos: val.sophos, datto: val.datto });
      })
    
      for (let i = 0; i < deviceCompList.length; i++) {
          if (deviceCompList[i].isEqual) {
              sheet.getCell(`A${i + 2}`).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "BAE7B5"} };
              sheet.getCell(`B${i + 2}`).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "BAE7B5"} };
          } else {
              sheet.getCell(`A${i + 2}`).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "DDB0B1"} };
              sheet.getCell(`B${i + 2}`).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "DDB0B1"} };
          }
      }

      return new Promise((resolve) => setTimeout(resolve, 0));
    })
  })

  promise.then(() => {
    workbook.xlsx.write(res);
  })
});

/* General Functions */

// Returns all devices for a site
async function GetSiteDevices(siteName) {
  let dattoDevices = [];
  let sophosDevices = [];

  await axios.get(`${localUrl}/api/datto/devices/${siteName}`)
    .then(doc => { doc.data.response ? dattoDevices = doc.data.response : dattoDevices = [] })
    .catch(err => "err")
  await axios.get(`${localUrl}/api/sophos/devices/${siteName}`)
    .then(doc => { doc.data.response ? sophosDevices = doc.data.response : sophosDevices = [] })
    .catch(err => "err")

  return { datto: dattoDevices, sophos: sophosDevices };
}

// Method for comparing string alphabetical order
function strcmp(a, b) {
    if (a === b) return 0;
    if (a > b) return 1;
    return -1;
}

// Filters Datto and Sophos device arrays into comparison
function GenerateComputerList(dattoDevices, sophosDevices) {
    const length = sophosDevices.length > dattoDevices.length ? sophosDevices.length : dattoDevices.length;
    let deviceList = [];

    for (let i = 0; i < length; i++) {
      if (sophosDevices[i] && dattoDevices[i]) {
        switch (strcmp(sophosDevices[i], dattoDevices[i])) {
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
          break;
        }
      }
    }

    return deviceList;
}

module.exports = router;