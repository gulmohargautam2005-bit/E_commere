const mongoose = require('mongoose');
const { Product } = require('./models/products');
const { SubCategory } = require('./models/subcategory');
const { Category } = require('./models/category');

const CONNECTION_STRING = 'mongodb+srv://gaurav:R1IGF1kPzCQ7nfzj@cluster0.gyjyaro.mongodb.net/eShopDatabase?retryWrites=true&w=majority';

mongoose.connect(CONNECTION_STRING)
  .then(async () => {
    console.log("Connected to MongoDB");
    const subCategories = await SubCategory.find().populate('category');
    
    for (let sub of subCategories) {
        if (sub.category?.name === 'Kidz' || sub.category?.name === 'Watches') {
            const count = await Product.countDocuments({ subcategory: sub._id });
            console.log(`SubCategory: ${sub.name} (Cat: ${sub.category.name}) -> Products: ${count}`);
        }
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
