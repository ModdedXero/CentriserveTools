const Blob = require("node:buffer").Blob;
const fs = require("fs");

const ReportGenerator = require("../reports/report_generator");

async function Initialize() {
    setInterval(async () => {
        Reports.forEach(async (rep) => {
            GenerateReport(() => rep.generator(), rep.title);
        })
    }, 60 * 60 * 1000);

    Reports.forEach(async (rep) => {
        GenerateReport(() => rep.generator(), rep.title);
    })
}

async function GenerateReport(repGen, title) {
    const wb = await repGen();

    await wb.xlsx.writeBuffer()
        .then(async data => {
            const blob = new Blob([data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
            await blob.arrayBuffer()
                .then(async array => {
                    fs.writeFile(`./reports/reports/${title}.xlsx`, Buffer.from(array), () => {})
                })
            })
            .catch(err => console.log(err))
        }

const Reports = [
    {
        title: "All Sites Agent Comparison",
        generator: () => {return ReportGenerator.GenAllSitesAgentComparison()},
    }
]

exports.Initialize = Initialize;