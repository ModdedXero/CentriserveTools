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

router.route("/categories").get(async (req, res) => {
    const categories = await warehouse.GetCategories();
    res.status(200).send(categories);
});

router.route("/categories/:category").get(async (req, res) => {
    const category = await warehouse.GetCategory(req.params.category);
    res.status(200).send(category);
});

router.route("/create/categories").post(async (req, res) => {
    await warehouse.CreateCategory(req.body.newVar);
    const categories = await warehouse.GetCategories();
    server.RealtimeSocket.emit(`inventory-categories`, categories);
});

router.route("/update/categories").post(async (req, res) => {
    await warehouse.UpdateCategory(
        req.body.upVar, 
        req.body.oldVar
    );

    const categories = await warehouse.GetCategories();
    server.RealtimeSocket.emit(`inventory-categories`, categories);
});

router.route("/delete/categories").post(async (req, res) => {
    await warehouse.DeleteCategory(req.body.delVar);

    const categories = await warehouse.GetCategories();
    server.RealtimeSocket.emit(`inventory-categories`, categories);
});

// Field Routes

router.route("/fields/:category").get(async (req, res) => {
    const fields = await warehouse.GetFields(
        req.params.category
    );
    res.status(200).send(fields);
});

router.route("/fields/create/:category").post(async (req, res) => {
    await warehouse.CreateField(
        req.params.category, req.body.newVar
    );

    const fields = await warehouse.GetFields(
        req.params.category
    );
    server.RealtimeSocket.emit(`inventory/fields-${req.params.category}`, fields);
});

router.route("/fields/update/:category").post(async (req, res) => {
    await warehouse.UpdateField(
        req.params.category, req.body.upVar, req.body.oldVar
    );

    const fields = await warehouse.GetFields(
        req.params.category
    );
    server.RealtimeSocket.emit(`inventory/fields-${req.params.category}`, fields);
});

router.route("/fields/delete/:category").post(async (req, res) => {
    await warehouse.DeleteField(
        req.params.category, req.body.delVar
    );

    const fields = await warehouse.GetFields(
        req.params.category
    );
    server.RealtimeSocket.emit(`inventory/fields-${req.params.category}`, fields);
});

// Frontend Routes

router.route("/inventory/categories/:location").get(async (req, res) => {
    const cats = await warehouse.GetInventoryCategories(req.params.location);
    res.status(200).send(cats);
});

router.route("/inventory/fields/update/:location/").post(async (req, res) => {
    await warehouse.CreateInventoryItem(req.params.location, req.body.oldVar, req.body.upVar);
    res.status(200).send("Item created");
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