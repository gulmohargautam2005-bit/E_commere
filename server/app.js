const express = require("express");
const app = express();

const mongoose = require("mongoose");
const cors = require("cors");
// const authJwt = require("./middleware/authJwt");
require("dotenv/config");

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000", // Fallback for local development
    credentials: true
}));
// app.use(authJwt());

//middleware

//routes
const userRoutes = require("./routes/user")
const productRoutes = require("./routes/products");
const categoryRoutes = require("./routes/categories");
const subCategoryRoutes = require("./routes/subcategory");
const cartRoutes = require("./routes/cart");
const ReviewRoutes = require("./routes/ProductReview")
const WhishRoutes = require("./routes/Mylist")
const orderRoutes = require("./routes/orders");

app.use('/api/category', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/subCat', subCategoryRoutes);
app.use('/api/user', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/review', ReviewRoutes);
app.use('/api/Whishlist', WhishRoutes);
app.use('/api/order', orderRoutes);


mongoose.connect(process.env.CONNECTION_STRING, {

}).then(() => {
    console.log("database connection is ready")

    app.listen(process.env.PORT, () => {
        console.log(`server is running http://localhost ${process.env.PORT}`)
    })
}).catch((err) => {
    console.log(err)
})



