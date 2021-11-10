const router = require("express").Router();
const axios = require("axios");
const ExcelJS = require("exceljs");

const localUrl = "http://127.0.0.1:5000";

router.route("/devices").get(async (req, res) => {

});

router.route("/sites").get(async (req, res) => {

});

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

/* General Functions */

function strcmp(a, b) {
    if (a === b) return 0;
    if (a > b) return 1;
    return -1;
}

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