const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongoose = require("mongoose");
const cors = require("cors");
const authJwt = require("./middleware/authJwt");
require("dotenv/config");

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:3000")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

app.use(cors({
    origin(origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        try {
            const host = new URL(origin).hostname;
            if (
                host.endsWith(".netlify.app") ||
                host.endsWith(".vercel.app") ||
                host === "localhost" ||
                host === "127.0.0.1" ||
                host.startsWith("192.168.") ||
                host.startsWith("10.") ||
                host.startsWith("172.")
            ) {
                return callback(null, true);
            }
        } catch (_) { /* ignore invalid origin */ }
        callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true
}));


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
app.use('/api/cart', authJwt, cartRoutes);
app.use('/api/review', ReviewRoutes);
app.use('/api/Whishlist', authJwt, WhishRoutes);
app.use('/api/order', authJwt, orderRoutes);


mongoose.connect(process.env.CONNECTION_STRING, {

}).then(() => {
    console.log("database connection is ready")

    app.listen(process.env.PORT, () => {
        console.log(`server is running http://localhost ${process.env.PORT}`)
    })
}).catch((err) => {
    console.log(err)
})



