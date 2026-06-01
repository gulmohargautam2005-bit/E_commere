const { Category } = require('../models/category');
const { Product } = require('../models/products');
const express = require("express");
const cloudinary = require("cloudinary").v2
const router = express.Router();
const pLimit = require("p-limit").default;
const multer = require("multer")
const path = require("path");
const { SubCategory, subCategorySchema } = require('../models/subcategory');
var imagesArr = [];



cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});





const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);   // <-- get .png/.jpg/etc
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage: storage })






router.post('/upload', upload.array("images"), async (req, res) => {
    try {
        const files = req.files;

        if (!files || files.length === 0) {
            return res.status(400).json({ message: "No files uploaded" });
        }

        const uploadedImages = [];

        for (let file of files) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: "products"
            });

            uploadedImages.push(result.secure_url);
        }

        res.status(200).json(uploadedImages);

    } catch (err) {
        console.error("UPLOAD ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});


router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    try {

        let filter = {};

        // 🔹 FIX 1: correct case + use regex for spaces
        if (req.query.catName !== undefined) {
            filter.catName = { $regex: new RegExp(req.query.catName, "i") };
        }
          if (req.query.subCat !== undefined) {
            filter.subCat = { $regex: new RegExp(req.query.subCat, "i") };
        }

        // 🔹 FIX 2: use filter in BOTH count + find
        const totalProducts = await Product.countDocuments(filter);

        const productList = await Product.find(filter)
            .populate("category")
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            products: productList,
            total: totalProducts,
            page,
            totalPages: Math.ceil(totalProducts / limit)
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
});
// GET products by subcategory id
router.get('/subCat/:id', async (req, res) => {
    try {
        const products = await Product.find({
            subcategory: req.params.id  
        })
        .populate('category')
        .populate('subcategory');

        res.status(200).json({
            products: products
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});
router.get("/products", async (req, res) => {
  try {

    const {
      category,
      subcategory,
      minprice,
      maxprice,
      brand,
      rating
    } = req.query;

    let filter = {};

    // category filter
    if (category) {
      filter.catName = category;
    }

    // subcategory filter
  if (subcategory) {
  filter.subcategory = subcategory;
}

    // price filter
    if (minprice || maxprice) {
      filter.price = {};

      if (minprice) {
        filter.price.$gte = Number(minprice);
      }

      if (maxprice) {
        filter.price.$lte = Number(maxprice);
      }
    }

    // brand filter
    if (brand) {
      filter.brand = brand;
    }

    // rating filter
    if (rating) {
      filter.rating = { $gte: Number(rating) };
    }

    const products = await Product.find(filter);

    res.json({
      success: true,
      count: products.length,
      products
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
});
router.post('/create', async (req, res) => {
    try {
        const category = await Category.findById(req.body.category);
        if (!category) {
            return res.status(404).send("invalid Category!");
        }

        const limit = pLimit(2);
        const images = req.body.images || [];

        if (!images.length) {
            return res.status(400).json({
                success: false,
                message: "No images provided"
            });
        }
        const imagesToUpload = req.body.images.map((image) => {
            return limit(async () => {
                const result = await cloudinary.uploader.upload(image);
                return result;
            });
        });

        const uploadStatus = await Promise.all(imagesToUpload);
        const imgUrl = uploadStatus.map((item) => item.secure_url);
        let product = new Product({
            name: req.body.name,
            description: req.body.description,
            images: req.body.images,
            brand: req.body.brand,
            price: req.body.price,
            discount: req.body.discount,
            catName:req.body.catName,
            subCat:req.body.subCat,
            productRam:req.body.productRam,
            productWeight:req.body.productWeight,
            productSize:req.body.productSize,
            category: req.body.category,
            subcategory:req.body.subcategory,
            countInstock: req.body.countInstock,
            rating: req.body.rating,
            isFeatured: req.body.isFeatured === true,
        })
        product = await product.save();
        if (!product) {
            res.status(500).json({
                message: "fuck",
                success: false,
            })
        }
        res.status(201).json(product)




    }

    catch (err) {
        // This catches Cloudinary errors or DB errors
        res.status(500).json({
            error: err.message || "Internal Server Error",
            success: false
        });
    }
})
router.get("/featured", async (req, res) => {
  const products = await Product.find({ isFeatured: true });
  res.json(products);
});





router.delete('/:id', async (req, res) => {
    const deletProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletProduct) {
        return res.status(404).json({
            message: "product not found!",
            status: false
        });
    }

    res.status(200).send({
        message: "the product is deleted!",
        status: true
    });
});
router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(500).json({
            message: 'The category with the given ID was not found.'
        });
    }

    return res.status(200).send(product);
});
router.put('/:id', async (req, res) => {
    try {
        const categoryDoc = await Category.findById(req.body.category)
        const subDoc = await SubCategory.findById(req.body.subcategory);

        const updatedData = {
            name: req.body.name,
            description: req.body.description,
            brand: req.body.brand,
            price: req.body.price,
            discount: req.body.discount,
            category: req.body.category,
            subcategory:req.body.subcategory,
            catName: categoryDoc ? categoryDoc.name : "",    
            subCat: req.body.subCat,
            productRam: req.body.productRam,
            productWeight: req.body.productWeight,
            productSize: req.body.productSize,
            countInstock: req.body.countInstock,
            rating: req.body.rating,
            isFeatured: req.body.isFeatured,
            images: req.body.images
        };

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true }
        );

        if (!product) {
            return res.status(404).json({
                message: 'Product not found',
                status: false
            });
        }

        res.status(200).json({
            message: "Product updated successfully",
            status: true,
            product
        });

    } catch (err) {
        res.status(500).json({
            message: err.message,
            status: false
        });
    }
});



module.exports = router