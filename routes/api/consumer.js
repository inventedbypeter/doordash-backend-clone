const express = require('express');
const router = express.Router();
const Item = require("../../models/Item");
const Menu = require("../../models/Menu");
const Order = require("../../models/Order");
const Restaurant = require("../../models/Restaurant");
var ObjectId = require("mongodb").ObjectId

router.post("/add/order", async (req, res) => {
    const restaurantId = req.body.restaurant_id;
    const objectRestaurantId = ObjectId(restaurantId);
    const restaurant = await Restaurant.findById(objectRestaurantId);

    if (!restaurant) {
        return res.status(404).send({});
    }
    else {
        const newOrder = new Order(req.body);
        newOrder.save().catch(err => console.log(err));
        return res.status(200).send(newOrder);
    }
})

// adding an order from a restaurant
// if restaurant exists
// if restaurant doesn't exist 404 error
// if restaurant does exist, create order document, save it to mongo db, send 200 with the order document


module.exports = router;