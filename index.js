require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const stripeRoute = require("./routes/stripe");
const cors = require("cors");
const morgan = require("morgan");

const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connection Successfull!"))
  .catch((err) => {
    console.log(err);
  });

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/checkout", stripeRoute);

/* const Product = require("./models/Product");
const products = require("./data"); */

app.listen(port, async () => {
  /* await Product.insertMany(products); */
  console.log(`Backend server is running on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("Welcome to MyDuka Backend");
});
