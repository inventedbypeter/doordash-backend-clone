const express = require("express");
const connectDB = require("./db")
const morgan = require("morgan");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const dashboard = require("./routes/api/dashboard");


const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, OPTIONS, DELETE');
  next();
});

app.use(morgan("dev"));
app.use(helmet());
connectDB();
app.use("/api/v1/dashboard", dashboard);


// http://localhost:5000/api/v1/dashboard/restaurant/register
// http://localhost:5000/api/v1/dashboard/fetch/restaurants
// http://localhost:5000/api/v1/dashboard/fetch/restaurant/dominossf@gmail.com
// http://localhost:5000/api/v1/dashboard/remove/restaurant/hello@gmail.com
// http://localhost:5000/api/v1/dashboard/update/restaurant
// http://localhost:5000/api/v1/dashboard/add/menu/:restaurant_id
// http://localhost:5000/api/v1/dashboard/fetch/menus/:restaurant_id
// http://localhost:5000/api/v1/dashboard/add/item/:menu_id
// http://localhost:5000/api/v1/dashboard/add/v2/item/:menu_id
// http://localhost:5000/api/v1/dashboard/fetch/items/:menu_id
// http://localhost:5000/api/v1/dashboard/remove/item/:item_id
// http://localhost:5000/api/v1/dashboard/update/item/:item_id
// http://localhost:5000/api/v1/dashboard/fetch/orders/restaurant_id
// req.params.email


app.listen(port, () => console.log(`API Server listening on port ${port}`));

