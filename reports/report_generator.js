const ExcelJS = require("exceljs");

const DattoData = require("../routes/data_helpers/datto_data");
const SophosData = require("../routes/data_helpers/sophos_data");

/* Helper Functions */

async function DownloadReport(res, repName) {
  res.sendFile(`${__dirname}/reports/${repName}.xlsx`);
}

/* Report Generators */

async function GenAllSitesAgentComparison() {
    const workbook = new ExcelJS.Workbook();
    let sites = [];
  
    sites = await SophosData.GetSites();
  
    for await (const siteName of sites) {
      let sheet;

      try {
        sheet = workbook.addWorksheet(siteName.name.substring(0, 30).replace(/[.*+?^${}()|\/[\]\\]/g, ""));
      } catch {
        sheet = workbook.addWorksheet(siteName.name.substring(0, 29).replace(/[.*+?^${}()|\/[\]\\]/g, "") + "1");
      }

      sheet.columns = [
          { header: "Sophos", key: "sophos", width: 30 }, 
          { header: "Datto", key: "datto", width: 30}
      ];

      const dattoDevices = await DattoData.GetDevices(siteName.name);
      const sophosDevices = await SophosData.GetDevices(siteName.id);

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
  
    const sheet = workbook.addWorksheet(siteName);
    sheet.columns = [
        { header: "Sophos", key: "sophos", width: 30 }, 
        { header: "Datto", key: "datto", width: 30}
    ];
  
    const dattoDevices = await DattoData.GetDevices(siteName.name);
    const sophosDevices = await SophosData.GetDevices(siteName.id);
  
    const deviceCompList = GenerateComputerList(dattoDevices, sophosDevices);
  
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

// Method for comparing string alphabetical order
function strcmp(a, b) {
  if (a === b) return 0;
  if (a > b) return 1;
  return -1;
}

// Filters Datto and Sophos device arrays into comparison
function GenerateComputerList(dattoDevices, sophosDevices) {
  const length = () => {
    if (dattoDevices && sophosDevices) {
      return dattoDevices.length + sophosDevices.length;
    } else if (!dattoDevices) {
      return sophosDevices.length;
    } else {
      return dattoDevices.length;
    }
  };

  let deviceList = [];

  for (let i = 0; i < length(); i++) {
    if (sophosDevices && dattoDevices && sophosDevices[i] && dattoDevices[i]) {
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
      if (!dattoDevices || (sophosDevices && sophosDevices[i] && !dattoDevices[i])) {
        deviceList.push({ isEqual: false, datto: "", sophos: sophosDevices[i] });
      } else if (!sophosDevices || (dattoDevices && !sophosDevices[i] && dattoDevices[i])) {
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
exports.DownloadReport = DownloadReport;