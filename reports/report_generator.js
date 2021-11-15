const axios = require("axios");
const ExcelJS = require("exceljs");

const localUrl = `http://127.0.0.1:${process.env.PORT || 5000}`;

/* Report Generators */

async function GenAllSitesAgentComparison() {
    const workbook = new ExcelJS.Workbook();
    let sites = [];
  
    await axios.get(`${localUrl}/api/sophos/sites`)
      .then(doc => { sites = [...new Set(doc.data.response)] })
  
    for await (const siteName of sites) {
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
    }

    return workbook;
}

async function GenSiteAgentComparison(siteName) {
    const workbook = new ExcelJS.Workbook();
  
    let dattoDevices = [];
    let sophosDevices = [];
    let deviceCompList = [];
  
    const sheet = workbook.addWorksheet(siteName);
    sheet.columns = [
        { header: "Sophos", key: "sophos", width: 30 }, 
        { header: "Datto", key: "datto", width: 30}
    ];
  
    await axios.get(`${localUrl}/api/datto/devices/${siteName}`)
        .then(doc => { dattoDevices = doc.data.response })
    await axios.get(`${localUrl}/api/sophos/devices/${siteName}`)
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
  
    return workbook;
}

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
    const length = sophosDevices.length + dattoDevices.length;
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
          return deviceList;
        }
      }
    }

    return deviceList;
}

exports.GenSiteAgentComparison = GenSiteAgentComparison;
exports.GenAllSitesAgentComparison = GenAllSitesAgentComparison;