const router = require("express").Router();
const warehouse = require("../database/warehouse");

router.route("/:location").get(async (req, res) => {
    const result = await warehouse.GetInventoryByLocation(req.params.location);

    if (result.length) {
        res.status(200).json({ response: result });
    } else {
        res.status(400).json({ response: "Failed to find Inventory Items!"})
    }
});

module.exports = router;