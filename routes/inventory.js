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

    console.log(result)
    if (result) {
        res.status(200).json({ response: `Created category ${req.body.category}`});
    } else {
        res.status(400).json({ response: `Failed to create category ${req.body.category}` });
    }
});

module.exports = router;