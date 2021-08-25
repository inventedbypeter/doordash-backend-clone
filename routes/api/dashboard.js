const express = require('express');
const router = express.Router();
const Item = require("../../models/Item");
const Menu = require("../../models/Menu");
const Order = require("../../models/Order");
const Restaurant = require("../../models/Restaurant");
var ObjectId = require("mongodb").ObjectId

router.post("/restaurant/register", async (req, res) => {
    const restaurant = await Restaurant.findOne({email : req.body.email})
    if (restaurant) {
        return res.status(400).send({});
    }
    else {
        const newRestaurant = new Restaurant(req.body);
        newRestaurant.save().catch(err => console.log(err));
        return res.status(200).send(newRestaurant);
    }
})

router.get("/fetch/restaurants", async (req, res) => {
    const restaurantList = await Restaurant.find();
    if (!restaurantList) {
        return res.status(404).send({});
    }
    else {
        return res.status(200).send(restaurantList);
    }
})

router.get("/fetch/restaurant/:email", async (req, res) => {
    const restaurant = await Restaurant.findOne({email : req.params.email});
    if (!restaurant) {
        return res.status(404).send({});
    }
    else {
        return res.status(200).send(restaurant);
    }
})

router.delete("/remove/restaurant/:email", async (req, res) => {
    const deletedRestaurant = await Restaurant.deleteOne({email : req.params.email});
    console.log("this is deletedRestaurant: " + deletedRestaurant);
    if (deletedRestaurant.deletedCount == 0) {
        return res.status(400).send({});
    }
    else {
        return res.status(200).send(deletedRestaurant);
    }
})

router.put("/update/restaurant", async (req, res) => {
    var query = {email: req.body.email};
    const updatedValues = {
        restaurant_name: req.body.restaurant_name,
        restaurant_menu: req.body.restaurant_menu,
        restaurant_category_tags: req.body.restaurant_category_tags,
        email: req.body.email,
        about_description: req.body.about_description,
        availability: req.body.availability,
        wait_time: req.body.wait_time
    }
    const updatedRestaurant = await Restaurant.findOneAndUpdate(query, updatedValues)
    if (!updatedRestaurant) {
        return res.status(404).send({});
    }
    else {
        return res.status(200).send(updatedValues);
    }
})

router.post("/add/menu/:restaurant_id", async (req, res) => {
    const id = req.params.restaurant_id;
    const objectId = ObjectId(id);
    const restaurant = await Restaurant.findById(objectId);
    if (!restaurant) {
        console.log("restaurant not exist")
        return res.status(404).send({});
    }
    else {
        const menu = await Menu.findOne({menu_name : req.body.menu_name});
        console.log(menu)

        if (!menu) {
            const newMenu = new Menu(req.body);
            newMenu.save().catch(err => console.log(err));
            return res.status(200).send(newMenu);
        }
        else {
            console.log("menu exist")
            return res.status(400).send({});
        }
    }
})

router.get("/fetch/menus/:restaurant_id", async (req, res) => {
    const menuList = await Menu.find({restaurant_id : req.params.restaurant_id});

    if (!menuList) {
        return res.status(404).send({});
    }
    else {
        console.log(menuList);
        return res.status(200).send(menuList);
    }
})

router.post("/add/item/:menu_id", async (req, res) => {
    const id = req.params.menu_id;
    const objectId = ObjectId(id);
    const menu = await Menu.findById(objectId);

    if (!menu) {
        return res.status(404).send({});
    }
    else {
        const itemList = await Item.find({menu_id : req.params.menu_id});
        
        var query = {_id : objectId};
        var itemsIdList = menu.items; 
        const newItem = new Item(req.body);
        itemsIdList.push(newItem._id)     // ["23232323"]
        const updatedValues = {
            menu_name : menu.menu_name,
            restaurant_id : menu.restaurant_id,
            category_tags : menu.category_tags,
            items : itemsIdList
        }

        if (itemList.length == 0) {
            await Menu.findOneAndUpdate(query, updatedValues);
            newItem.save().catch(err => console.log(err));
            return res.status(200).send(newItem);
        }
        else {
            for (var i = 0; i < itemList.length; i++) {
                var item = itemList[i];

                if (item.item_name == req.body.item_name) {
                    return res.status(400).send({});
                }
            }
            await Menu.findOneAndUpdate(query, updatedValues);
            newItem.save().catch(err => console.log(err));
            return res.status(200).send(newItem);
        }
    }
})

router.post("/add/v2/item/:menu_id", async (req, res) => {
    const id = req.params.menu_id;
    const objectId = ObjectId(id);
    const menu = await Menu.findById(objectId);

    if (!menu) {
        return res.status(404).send({});
    }
    else {
        const itemList = await Item.find({menu_id : req.params.menu_id, item_name : req.body.item_name});
        
        var query = {_id : objectId};
        var itemsIdList = menu.items; // [0,1]
        const newItem = new Item(req.body);
        itemsIdList.push(newItem._id); // [0,1,2]
        const updatedValues = {
            menu_name : menu.menu_name,
            restaurant_id : menu.restaurant_id,
            category_tags : menu.category_tags,
            items : itemsIdList
        }

        if (itemList.length == 0) {
            await Menu.findOneAndUpdate(query, updatedValues);
            newItem.save().catch(err => console.log(err));
            return res.status(200).send(newItem);
        }
        else {
            return res.status(400).send({});
        }
    }
})

router.get("/fetch/items/:menu_id", async (req, res) => {
    const id = req.params.menu_id;
    const objectId = ObjectId(id);
    const menu = Menu.findById(objectId);

    if (!menu) {
        return res.status(404).send({});
    }
    else {
        const allItems = await Item.find({menu_id : id});
        return res.status(200).send(allItems)
    }
})

// get all items from a specific menu
// convert menu_id into ObjectID
// Make sure the menu exists
// If the menu doesn't exist, send the error code
// If the menu exists, get all items in that menu

router.delete("/remove/item/:item_id", async (req, res) => {
    const itemId = req.params.item_id;
    const objectId = ObjectId(itemId);
    const deletedItem = await Item.findOneAndDelete({_id : objectId});

    if (!deletedItem) {
        return res.status(404).send({});
    }
    else {
        const menuObjectId = ObjectId(deletedItem.menu_id);
        const menu = await Menu.findById(menuObjectId);
        const itemsList = menu.items; // itemsList = [611b3b853251e423f2bd2960, 611b3c943251e423f2bd2968]
        const filteredItemList = [];
        for (var i = 0; i < itemsList.length; i++) {

            if (!itemsList[i].equals(deletedItem._id)) {
                filteredItemList.push(itemsList[i])
            }
        }
        const query = {_id : menuObjectId};
        const updatedValues = {
            menu_name : menu.menu_name,
            restaurant_id: menu.restaurant_id, 
            category_tags: menu.category_tags,
            items: filteredItemList
        }
        await Menu.findOneAndUpdate(query, updatedValues);
        return res.status(200).send(deletedItem);
    }
})

// else, delete the item and update the menu's items array by removing the item object id we deleted

router.put("/update/item/:item_id", async (req, res) => {
    const itemId = req.params.item_id;
    const objectItemId = ObjectId(itemId);

    const query = {_id : objectItemId}
    const updatedValue = {
        restaurant_id: req.body.restaurant_id,
        menu_id: req.body.menu_id,
        item_category_tags: req.body.item_category_tags,
        price: req.body.price,
        imageURL: req.body.imageURL,
        item_name: req.body.item_name
    }

    const updatedItem = await Item.findOneAndUpdate(query, updatedValue);

    if (!updatedItem) {
        return res.status(404).send({});
    }
    else {
        return res.status(200).send(updatedValue);
    }
})

router.get("/fetch/orders/restaurant_id", async (req, res) => {
    const restaurantId = req.params.restaurant_id;
    const objectRestaurantId = ObjectId(restaurantId);

    const restaurant = await Restaurant.findById(objectRestaurantId);

    if (!restaurant) {
        return res.status(404).send({})
    }
    else {
        const orders = await Order.find({restaurant_id : restaurantId})
        return res.status(200).send(orders);
    }
})

// convert restataurant_id into objectId
// get the resraurant with .findById api call
// if the restaurant exists, .find api call for orders
// if the restaurant doesn't exist user error


module.exports = router;