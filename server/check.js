const mongoose = require('mongoose');
const { Category } = require('./models/category');
const { SubCategory } = require('./models/subcategory');

const CONNECTION_STRING = 'mongodb+srv://gaurav:R1IGF1kPzCQ7nfzj@cluster0.gyjyaro.mongodb.net/eShopDatabase?retryWrites=true&w=majority';

mongoose.connect(CONNECTION_STRING)
  .then(async () => {
    console.log("Connected to MongoDB");
    const categories = await Category.find();
    console.log("Categories:", categories.map(c => ({ id: c._id, name: c.name })));
    
    const subCategories = await SubCategory.find().populate('category');
    console.log("SubCategories:", subCategories.map(s => ({ id: s._id, name: s.subCat, category: s.category?.name })));
    
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
