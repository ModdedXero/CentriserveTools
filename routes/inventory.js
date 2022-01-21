const router = require("express").Router();
const server = require("../server");
const warehouse = require("../database/warehouse");

// Location Routes

router.route("/locations").get(async (req, res) => {
    const locations = await warehouse.GetAllLocations();
    res.status(200).send(locations);
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
    if (!req.body.upVar[1]) {
        await warehouse.CreateInventoryItem(req.params.location, req.body.oldVar, req.body.upVar[0]);
        res.status(200).send("Item created");
    } else {
        await warehouse.UpdateInventoryItem(req.params.location, req.body.oldVar, req.body.upVar[0], req.body.upVar[1]);
        res.status(200).send("Item updated");
    }
});

// Checkout Routes

router.route("/checkout/:location").post(async (req, res) => {
    const result = await warehouse.SubmitCheckout(req.params.location, req.body.data);
    res.send(result);
});

module.exports = router;