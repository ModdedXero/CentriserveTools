const router = require("express").Router();
const server = require("../server");
const warehouse = require("../database/warehouse");

router.route("/locations").post(async (req, res) => {
    const locations = await warehouse.GetAllLocations();
    const sortedLocations = [];

    for (const loc of locations) {
        sortedLocations.push({
            value: loc,
            label: loc.toUpperCase()
        });
    }

    res.status(200).send(sortedLocations);
});

router.route("/create/locations").post(async (req, res) => {
    await warehouse.CreateInventoryLocation(req.body.newVar);
    const locations = await warehouse.GetAllLocations();
    const sortedLocations = [];

    for (const loc of locations) {
        sortedLocations.push({
            value: loc,
            label: loc.toUpperCase()
        });
    }

    server.RealtimeSocket.emit(`inventory-locations`, sortedLocations);
});

router.route("/update/locations").post(async (req, res) => {
    await warehouse.UpdateInventoryLocation(req.body.upVar, req.body.oldVar);
    const locations = await warehouse.GetAllLocations();
    const sortedLocations = [];

    for (const loc of locations) {
        sortedLocations.push({
            value: loc,
            label: loc.toUpperCase()
        });
    }

    server.RealtimeSocket.emit(`inventory-locations`, sortedLocations);
});

router.route("/delete/locations").post(async (req, res) => {
    await warehouse.DeleteInventoryLocation(req.body.delVar);
    
    const locations = await warehouse.GetAllLocations();
    const sortedLocations = [];

    for (const loc of locations) {
        sortedLocations.push({
            value: loc,
            label: loc.toUpperCase()
        });
    }

    server.RealtimeSocket.emit(`inventory-locations`, sortedLocations);
    res.status(200).send(`Location ${req.body.delVar} has been deleted`);
});

router.route("/categories/:location").post(async (req, res) => {
    
});

// router.route("/locations").post((req, res) => {
//     res.send([
//         {
//             value: "Test1",
//             label: "TEST1"
//         },
//         {
//             value: "Test2",
//             label: "TEST2"
//         }
//     ]);
//     console.log("Test");
// });

// router.route("/categories/:location").post((req, res) => {
//     if (req.params.location === "Test1") {
//         res.send(["Test1 Suc!"]);
//         server.RealtimeSocket.emit(`inventory/categories-${req.params.location}`, ["Test1 Super Suc!"])
//     }
//     if (req.params.location === "Test2") res.send(["Test2 Suc!"]);
//     if (req.params.location === "Test3") res.send(["Test3 Suc!"]);
// });

module.exports = router;