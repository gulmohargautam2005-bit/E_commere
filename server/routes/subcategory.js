const express = require('express');
const { SubCategory } = require('../models/subcategory');
const { Category } = require('../models/category');

const router = express.Router();

// Get all subcategories with pagination
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = 10;
        const totalPosts = await SubCategory.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage);

        if (page > totalPages && totalPages > 0) {
            return res.status(404).json({ message: 'Page not found' });
        }

        const subCategoryList = await SubCategory.find()
            .populate('category')
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec();

        if (!subCategoryList) {
            return res.status(500).json({ success: false });
        }

        return res.status(200).json({
            subCategoryList: subCategoryList,
            totalPages: totalPages,
            page: page
        });
    } catch (err) {
        res.status(500).json({
            error: err.message || 'Internal Server Error',
            success: false
        });
    }
});



router.get('/subCat/:id', async (req,res)=>{
    try{
        const products = await Product.find({
            subcategory: req.params.id   // ObjectId match
        })
        .populate('category')
        .populate('subcategory');

        res.status(200).json({
            products,
            success:true
        });
    }
    catch(err){
        res.status(500).json({
            error: err.message,
            success:false
        });
    }
});

router.post('/create', async (req, res) => {
    try {
       
        const category = await Category.findById(req.body.category);
        if (!category) {
            return res.status(400).json({
                success: false,
                message: 'Category not found'
            });
        }

   
        const existingSubCat = await SubCategory.findOne({
            category: req.body.category,
            subCat: req.body.subCat
        });

        if (existingSubCat) {
            return res.status(400).json({
                success: false,
                message: 'Subcategory already exists for this category'
            });
        }

        let subCategory = new SubCategory({
            category: req.body.category,
            subCat: req.body.subCat
        });

        subCategory = await subCategory.save();
        const populatedSubCategory = await SubCategory.findById(subCategory._id).populate('category');

        res.status(201).json(populatedSubCategory);
    } catch (err) {
        res.status(500).json({
            error: err.message || 'Internal Server Error',
            success: false
        });
    }
});


router.put('/:id', async (req, res) => {
    try {
        // Validate category exists if it's being updated
        if (req.body.category) {
            const category = await Category.findById(req.body.category);
            if (!category) {
                return res.status(400).json({
                    success: false,
                    message: 'Category not found'
                });
            }
        }

        const subCategory = await SubCategory.findByIdAndUpdate(
            req.params.id,
            {
                category: req.body.category,
                subCat: req.body.subCat
            },
            { new: true }
        ).populate('category');

        if (!subCategory) {
            return res.status(404).json({
                message: 'Subcategory cannot be updated!',
                success: false
            });
        }

        res.status(200).send(subCategory);
    } catch (err) {
        res.status(500).json({
            error: err.message || 'Internal Server Error',
            success: false
        });
    }
});
router.get('/:id', async (req,res)=>{
   const product = await Product.findById(req.params.id);
   res.json(product);
});


router.delete('/:id', async (req, res) => {
    try {
        const deletedSubCategory = await SubCategory.findByIdAndDelete(req.params.id);

        if (!deletedSubCategory) {
            return res.status(404).json({
                message: 'Subcategory not found!',
                success: false
            });
        }

        res.status(200).json({
            success: true,
            message: 'Subcategory Deleted!'
        });
    } catch (err) {
        res.status(500).json({
            error: err.message || 'Internal Server Error',
            success: false
        });
    }
});

module.exports = router;

