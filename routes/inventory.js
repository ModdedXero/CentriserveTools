const router = require("express").Router();
const server = require("../server");
const warehouse = require("../database/warehouse");

// Location Routes

router.route("/locations").get(async (req, res) => {
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

// Category Routes

router.route("/categories/:location").get(async (req, res) => {
    const categories = await warehouse.GetCategories(req.params.location);
    res.status(200).send(categories);
});

router.route("/categories/create/:location").post(async (req, res) => {
    await warehouse.CreateInventoryCategory(req.params.location, req.body.newVar);
    const categories = await warehouse.GetCategories(req.params.location);
    server.RealtimeSocket.emit(`inventory/categories-${req.params.location}`, categories);
});

router.route("/categories/update/:location").post(async (req, res) => {
    await warehouse.UpdateInventoryCategory(
        req.params.location, 
        req.body.upVar, 
        req.body.oldVar
    );

    const categories = await warehouse.GetCategories(req.params.location);
    server.RealtimeSocket.emit(`inventory/categories-${req.params.location}`, categories);
});

router.route("/categories/delete/:location").post(async (req, res) => {
    await warehouse.DeleteInventoryCategory(req.params.location, req.body.delVar);

    const categories = await warehouse.GetCategories(req.params.location);
    server.RealtimeSocket.emit(`inventory/categories-${req.params.location}`, categories);
});

// Field Routes

router.route("/fields/:location/:category").get(async (req, res) => {
    const fields = await warehouse.GetFields(
        req.params.location, req.params.category
    );
    res.status(200).send(fields);
});

router.route("/fields/:location/create/:category").post(async (req, res) => {
    await warehouse.CreateField(
        req.params.location, req.params.category, req.body.newVar
    );

    const fields = await warehouse.GetFields(
        req.params.location, req.params.category
    );
    server.RealtimeSocket.emit(`inventory/fields/${req.params.location}-${req.params.category}`, fields);
});

router.route("/fields/:location/update/:category").post(async (req, res) => {
    await warehouse.UpdateField(
        req.params.location, req.params.category, req.body.upVar, req.body.oldVar
    );

    const fields = await warehouse.GetFields(
        req.params.location, req.params.category
    );
    server.RealtimeSocket.emit(`inventory/fields/${req.params.location}-${req.params.category}`, fields);
});

router.route("/fields/:location/delete/:category").post(async (req, res) => {
    await warehouse.UpdateField(
        req.params.location, req.params.category, req.body.delVar
    );

    const fields = await warehouse.GetFields(
        req.params.location, req.params.category
    );
    server.RealtimeSocket.emit(`inventory/fields/${req.params.location}-${req.params.category}`, fields);
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