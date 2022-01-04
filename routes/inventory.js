const router = require("express").Router();
const warehouse = require("../database/warehouse");

router.route("/locations").get(async (req, res) => {
    const result = await warehouse.GetAllLocations();

    if (result.length) {
        res.status(200).json({ response: result });
    } else {
        res.status(400).json({ response: "Can't get locations!" });
    }
});

router.route("/location/:location").get(async (req, res) => {
    const result = await warehouse.GetInventoryByLocation(req.params.location.toLowerCase());

    if (result) {
        res.status(200).json({ response: result });
    } else {
        res.status(400).json({ response: `Failed to find inventory for ${req.params.location}` });
    }
});

router.route("/location/create").post(async (req, res) => {
    const result = await warehouse.CreateNewInventoryLocation(req.body.location.toLowerCase());

    if (result) {
        res.status(200).json({ response: `Created location ${req.body.location}` });
    } else {
        res.status(200).json({ response: `Failed to create location ${req.body.location}` });
    }
});

router.route("/category").post(async (req, res) => {
    const result = await warehouse.CreateNewInventoryCategory(req.body.location, req.body.category);

    if (result) {
        res.status(200).json({ response: `Created category ${req.body.category}`});
    } else {
        res.status(400).json({ response: `Failed to create category ${req.body.category}` });
    }
});

router.route("/item/add").post(async (req, res) => {
    const result = await warehouse.AddInventoryCategoryItem(
        req.body.location, req.body.category, req.body.item
    );

    if (result) {
        res.status(200).json({ response: `Created item ${req.body.item.name}`});
    } else {
        res.status(400).json({ response: `Failed to create item ${req.body.item.name}` });
    }
})

router.route("/item/update").post(async (req, res) => {
    const result = await warehouse.UpdateInventoryCategoryItem(
        req.body.location, req.body.category, req.body.item
    );

    if (result) {
        res.status(200).json({ response: `Updated item ${req.body.item.name}`});
    } else {
        res.status(400).json({ response: `Failed to update item ${req.body.item.name}` });
    }
})

router.route("/checkout").post(async (req, res) => {
    const result = await warehouse.CheckoutInventoryItems(
        req.body.location, req.body.checkoutData, req.body.reason
    );

    if (result) {
        res.status(200).json({ response: `Checkedout items`});
    } else {
        res.status(400).json({ response: `Failed to checkout items` });
    }
})

module.exports = router;