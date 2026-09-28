const mongoose = require('mongoose');
const { Category } = require('./models/category');
const { SubCategory } = require('./models/subcategory');
const { Product } = require('./models/products');
require('dotenv').config();

const connectionString = process.env.CONNECTION_STRING;

if (!connectionString) {
    console.error("Error: CONNECTION_STRING env variable is not defined");
    process.exit(1);
}

// Helper to generate 3-paragraph realistic descriptions
function generateDescription(category, subCategory, name, brand) {
    let p1 = "";
    let p2 = "";
    let p3 = "";
    
    const groceryCategories = ["Fruits & Vegetables", "Meats & Seafood", "Breakfast & Dairy", "Beverages", "Breads & Bakery", "Frozen Foods", "Biscuits & Snacks", "Grocery & Staples"];

    if (groceryCategories.includes(category)) {
        p1 = `Experience the premium quality of our ${name} from ${brand}. Hand-selected to ensure the finest freshness, texture, and flavor, this product is a staple for any kitchen. Whether you are preparing a daily family meal or hosting a special gathering, its outstanding quality and natural goodness will elevate your recipes and delight your taste buds.`;
        p2 = `Sourced from trusted growers and ethical producers, this item is packed with essential nutrients, vitamins, and wholesome goodness. We follow strict quality control standards throughout harvesting, packaging, and shipping to preserve maximum flavor and integrity. It is free from unnecessary additives and artificial preservatives.`;
        p3 = `For optimal freshness, keep stored in a cool, dry place or refrigerate after opening as appropriate. Each batch is carefully inspected and comes with the ${brand} satisfaction guarantee. Enjoy fresh, healthy, and delicious options every day with Luxe Groceries.`;
    } else if (category === "Fashion") {
        p1 = `Introducing the ${name} by ${brand}, a masterclass in modern fashion. Designed for individuals who refuse to compromise on style or utility, this piece features premium fabrics that offer both luxurious comfort and durability. The attention to detail is evident in every single stitch, offering a tailored fit that complements a wide range of body types.`;
        p2 = `Constructed with premium raw materials, this product is highly breathable and adapts seamlessly to your movements. Whether you are dressing up for a formal occasion or keeping it casual for a weekend outing, its versatility ensures you look polished and put-together. The styling is classic yet incorporates contemporary accents to keep your wardrobe fresh.`;
        p3 = `To preserve the texture and longevity of this garment, we recommend a gentle machine wash in cold water or professional dry cleaning. Avoid harsh detergents and tumble dry on a low setting. Each purchase comes with the ${brand} quality guarantee, ensuring this style remains a favorite in your collection for seasons to come.`;
    } else if (category === "Electronics") {
        p1 = `Elevate your digital life with the ${name} from ${brand}. Packed with cutting-edge technology and boasting a sleek, ergonomic design, this device is engineered to deliver unmatched performance for work and play. Its intuitive interface and high-speed processing power make multi-tasking effortless, saving you time and energy daily.`;
        p2 = `Inside its refined chassis, you will find top-tier components that ensure speed, stability, and longevity. The high-resolution display and optimized acoustic engineering provide an immersive sensory experience whether you are watching films, gaming, or taking critical business calls. It is designed to work efficiently with minimal energy consumption.`;
        p3 = `The device comes pre-packaged with a fast-charging cable, user guide, and a comprehensive manufacturer warranty. Regular firmware updates are provided by ${brand} to maintain optimal security and introduce new features over time. Store in a cool, dry place and use the included protective cover to keep it pristine.`;
    } else if (category === "Watches") {
        p1 = `Celebrate the art of timekeeping with the ${name} timepiece by ${brand}. Perfectly balancing traditional horological craftsmanship with contemporary design, this watch makes a bold statement on any wrist. The dial is protected by scratch-resistant sapphire crystal glass and housed in a marine-grade stainless steel casing for ultimate durability.`;
        p2 = `At its heart lies a highly precise caliber movement, ensuring accurate time tracking through years of wear. The strap is crafted from hand-selected materials—be it top-grain leather or a brushed metal bracelet—designed to conform comfortably to your wrist. Water resistance up to 50 meters makes it robust enough for everyday splash protection.`;
        p3 = `Every watch is hand-assembled and rigorously tested by master horologists before release. The ${name} arrives in a premium presentation box, making it a perfect gift for special milestones or a valuable addition to your personal collection. Clean regularly with a soft dry microfiber cloth.`;
    } else if (category === "Kidz") {
        p1 = `Bring joy and comfort to your little ones with the ${name} by ${brand}. Crafted from ultra-soft, hypoallergenic, and non-toxic materials, this product prioritizes your child's safety and comfort above all else. Its playful design and vibrant colors are sure to capture their imagination and keep them engaged and happy.`;
        p2 = `We understand that kids' products need to endure active play and daily wear. That is why this item is built with reinforced stitching and child-proof components that withstand rough-and-tumble use. It meets all international safety guidelines, giving parents complete peace of mind during playtime.`;
        p3 = `Easy to clean and maintain, it can be wiped down or machine washed depending on the specific item care label. Lightweight and portable, it is perfect for family trips, school days, or home activities. ${brand} is dedicated to creating products that grow with your child.`;
    } else if (category === "Home & Living") {
        p1 = `Transform your living space into a sanctuary of comfort and style with the ${name} by ${brand}. Designed to blend seamlessly with both modern minimalist and classic traditional interiors, this piece adds a refined touch to any room. We select premium, sustainably sourced materials to ensure eco-friendly elegance.`;
        p2 = `This home essential is engineered for functionality as much as beauty. Whether it is providing ergonomic support, ambient illumination, or organization, it enhances the utility of your living space. The robust construction guarantees it will remain a cornerstone of your home decor for years.`;
        p3 = `Minimal assembly is required with clear instructions and tools included in the package. For care, avoid direct exposure to sunlight and wipe clean with a damp cloth as needed. Discover the difference that premium craftsmanship makes in your everyday routines with ${brand}.`;
    } else { // Beauty
        p1 = `Reveal your natural radiance with the ${name} by ${brand}. Formulated with nutrient-rich botanical extracts and active dermatological ingredients, this product nourishes your skin and hair from the inside out. It is suitable for all skin types and free from parabens, sulfates, and synthetic fragrances.`;
        p2 = `Our lightweight formula absorbs rapidly without leaving any greasy residue, delivering hydration and essential vitamins directly where they are needed. Regular application helps restore natural barriers, leaving your skin feeling supple, soft, and visibly refreshed after just a few days of use.`;
        p3 = `For best results, incorporate this into your morning and evening self-care routines. Apply a small amount to clean skin or hair and massage gently in circular motions. Cruelty-free and dermatologically tested, it represents ${brand}'s commitment to clean, conscious beauty.`;
    }

    return `${p1}\n\n${p2}\n\n${p3}`;
}

const seedData = async () => {
    try {
        console.log("Connecting to database...");
        await mongoose.connect(connectionString);
        console.log("Connected to MongoDB successfully!");

        // 1. Clear database
        console.log("Clearing existing Categories, SubCategories, and Products...");
        await Category.deleteMany({});
        await SubCategory.deleteMany({});
        await Product.deleteMany({});
        console.log("Database cleared!");

        // 2. Define Category configurations (Combined: 6 Luxe Categories + 8 Grocery Categories)
        const categoriesConfig = [
            // Luxe/Lifestyle categories
            { name: "Fashion", color: "#e67e22", images: ["https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80"] },
            { name: "Electronics", color: "#2980b9", images: ["https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80"] },
            { name: "Watches", color: "#2c3e50", images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80"] },
            { name: "Kidz", color: "#e74c3c", images: ["https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600&q=80"] },
            { name: "Home & Living", color: "#27ae60", images: ["https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&q=80"] },
            { name: "Beauty", color: "#9b59b6", images: ["https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80"] },
            
            // Grocery Categories
            { name: "Fruits & Vegetables", color: "#27ae60", images: ["https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80"] },
            { name: "Meats & Seafood", color: "#e74c3c", images: ["https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&q=80"] },
            { name: "Breakfast & Dairy", color: "#f1c40f", images: ["https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&q=80"] },
            { name: "Beverages", color: "#e67e22", images: ["https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=600&q=80"] },
            { name: "Breads & Bakery", color: "#d35400", images: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80"] },
            { name: "Frozen Foods", color: "#2980b9", images: ["https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?w=600&q=80"] },
            { name: "Biscuits & Snacks", color: "#8e44ad", images: ["https://images.unsplash.com/photo-1599490659213-e219942c6f72?w=600&q=80"] },
            { name: "Grocery & Staples", color: "#16a085", images: ["https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&q=80"] }
        ];

        // Save categories and build map of Category Name -> Category Document
        const categoriesMap = {};
        for (const cat of categoriesConfig) {
            const newCat = new Category(cat);
            const savedCat = await newCat.save();
            categoriesMap[savedCat.name] = savedCat;
        }
        console.log(`Seeded ${Object.keys(categoriesMap).length} main categories.`);

        // 3. Define Subcategories for each Category
        const subcategoriesConfig = {
            // Luxe categories
            "Fashion": ["Women's Dresses", "Men's Shirts", "Jackets & Coats", "Denim", "Footwear", "Accessories"],
            "Electronics": ["Smartphones", "Laptops", "Audio & Headphones", "Cameras", "Smart Home", "Gaming"],
            "Watches": ["Luxury Watches", "Sport Watches", "Smart Watches", "Classic Collection", "Limited Edition"],
            "Kidz": ["Boys Clothing", "Girls Clothing", "Baby Essentials", "Toys & Games", "School Gear"],
            "Home & Living": ["Furniture", "Décor", "Kitchen", "Bedding & Bath", "Lighting"],
            "Beauty": ["Skincare", "Makeup", "Fragrances", "Hair Care", "Wellness"],

            // Grocery categories
            "Fruits & Vegetables": ["Fresh Fruits", "Fresh Vegetables"],
            "Meats & Seafood": ["Fresh Poultry", "Fresh Seafood"],
            "Breakfast & Dairy": ["Milk & Butter", "Eggs & Yogurt"],
            "Beverages": ["Soft Drinks", "Tea & Coffee"],
            "Breads & Bakery": ["Fresh Bread", "Pastries & Muffins"],
            "Frozen Foods": ["Frozen Meals", "Frozen Desserts"],
            "Biscuits & Snacks": ["Chips & Crackers", "Cookies & Biscuits"],
            "Grocery & Staples": ["Rice & Grains", "Oils & Sauces"]
        };

        // Save subcategories and build nested map of Category Name -> Subcategory Name -> SubCategory Document
        const subcategoriesMap = {};
        let subcatCount = 0;
        for (const catName in subcategoriesConfig) {
            subcategoriesMap[catName] = {};
            const parentCat = categoriesMap[catName];
            
            for (const subName of subcategoriesConfig[catName]) {
                const newSub = new SubCategory({
                    category: parentCat._id,
                    subCat: subName
                });
                const savedSub = await newSub.save();
                subcategoriesMap[catName][subName] = savedSub;
                subcatCount++;
            }
        }
        console.log(`Seeded ${subcatCount} subcategories.`);

        // 4. Define product seed data templates
        const productsDefinitions = {
            // ================== LUXE PRODUCTS ==================
            "Fashion": {
                "Women's Dresses": [
                    { name: "Silk Satin Evening Slip Dress", brand: "Atelier Luxe", price: 2999, discount: 15, rating: 4.8, count: 45, size: ["XS", "S", "M", "L"], ram: [], weight: ["0.3kg"], images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80", "https://images.unsplash.com/photo-1618932260643-eee4a2f6c9d6?w=800&q=80"] },
                    { name: "Boho Floral Pleated Maxi Dress", brand: "Aura Boutique", price: 1899, discount: 10, rating: 4.5, count: 60, size: ["S", "M", "L", "XL"], ram: [], weight: ["0.4kg"], images: ["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80", "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=800&q=80"] },
                    { name: "Classic French Knit Wrap Dress", brand: "Atelier Luxe", price: 2499, discount: 5, rating: 4.6, count: 30, size: ["S", "M", "L"], ram: [], weight: ["0.5kg"], images: ["https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&q=80"] },
                    { name: "Velvet Off-Shoulder Midi Gown", brand: "Elysian Wear", price: 3499, discount: 20, rating: 4.9, count: 25, size: ["XS", "S", "M", "L"], ram: [], weight: ["0.6kg"], images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80"] },
                    { name: "Linen Casual A-Line Dress", brand: "Nordic Thread", price: 1499, discount: 0, rating: 4.2, count: 80, size: ["S", "M", "L", "XL", "XXL"], ram: [], weight: ["0.3kg"], images: ["https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=800&q=80"] }
                ],
                "Men's Shirts": [
                    { name: "Oxford Slim-Fit Cotton Shirt", brand: "Nordic Thread", price: 1299, discount: 10, rating: 4.4, count: 120, size: ["M", "L", "XL", "XXL"], ram: [], weight: ["0.25kg"], images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80", "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80"] },
                    { name: "Casual Denim Chambray Shirt", brand: "Denim Co.", price: 1599, discount: 15, rating: 4.3, count: 90, size: ["S", "M", "L", "XL"], ram: [], weight: ["0.35kg"], images: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80"] },
                    { name: "Linen Breathable Summer Shirt", brand: "Aura Boutique", price: 1799, discount: 5, rating: 4.6, count: 50, size: ["M", "L", "XL"], ram: [], weight: ["0.2kg"], images: ["https://images.unsplash.com/photo-1588359348347-9bc6cbaa689f?w=800&q=80"] },
                    { name: "Formal Micro-Check Dress Shirt", brand: "Nordic Thread", price: 1999, discount: 20, rating: 4.7, count: 70, size: ["S", "M", "L", "XL", "XXL"], ram: [], weight: ["0.3kg"], images: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80"] },
                    { name: "Printed Cuban Collar Resort Shirt", brand: "Elysian Wear", price: 1199, discount: 0, rating: 4.1, count: 110, size: ["S", "M", "L", "XL"], ram: [], weight: ["0.22kg"], images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80"] }
                ],
                "Jackets & Coats": [
                    { name: "Vintage Biker Leather Jacket", brand: "Atelier Luxe", price: 5999, discount: 20, rating: 4.9, count: 20, size: ["S", "M", "L", "XL"], ram: [], weight: ["1.2kg"], images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80", "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80"] },
                    { name: "Waterproof Hooded Windbreaker", brand: "Nordic Thread", price: 2499, discount: 10, rating: 4.4, count: 85, size: ["M", "L", "XL"], ram: [], weight: ["0.5kg"], images: ["https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=80"] },
                    { name: "Classic Wool Trench Coat", brand: "Atelier Luxe", price: 4999, discount: 15, rating: 4.8, count: 35, size: ["S", "M", "L", "XL"], ram: [], weight: ["1.5kg"], images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80"] },
                    { name: "Urban Sherpa Bomber Jacket", brand: "Elysian Wear", price: 2999, discount: 12, rating: 4.5, count: 40, size: ["M", "L", "XL"], ram: [], weight: ["0.8kg"], images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80"] },
                    { name: "Packable Lightweight Down Vest", brand: "Nordic Thread", price: 1899, discount: 5, rating: 4.3, count: 100, size: ["S", "M", "L", "XL"], ram: [], weight: ["0.3kg"], images: ["https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=80"] }
                ],
                "Denim": [
                    { name: "Classic 501 Straight Fit Jeans", brand: "Denim Co.", price: 2299, discount: 10, rating: 4.6, count: 140, size: ["30", "32", "34", "36"], ram: [], weight: ["0.65kg"], images: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80", "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80"] },
                    { name: "Distressed Skinny Stretch Jeans", brand: "Denim Co.", price: 2499, discount: 15, rating: 4.3, count: 100, size: ["28", "30", "32", "34"], ram: [], weight: ["0.6kg"], images: ["https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80"] },
                    { name: "High-Waisted Wide Leg Denim", brand: "Aura Boutique", price: 2199, discount: 5, rating: 4.5, count: 75, size: ["26", "28", "30", "32"], ram: [], weight: ["0.7kg"], images: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80"] },
                    { name: "Relaxed Fit Denim Jacket", brand: "Denim Co.", price: 2799, discount: 18, rating: 4.7, count: 50, size: ["S", "M", "L", "XL"], ram: [], weight: ["0.85kg"], images: ["https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80"] },
                    { name: "Acid Wash Denim Skirt", brand: "Aura Boutique", price: 1699, discount: 0, rating: 4.2, count: 65, size: ["26", "28", "30", "32"], ram: [], weight: ["0.45kg"], images: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80"] }
                ],
                "Footwear": [
                    { name: "Minimalist Leather White Sneakers", brand: "Soleste", price: 3499, discount: 10, rating: 4.7, count: 80, size: ["7", "8", "9", "10", "11"], ram: [], weight: ["0.9kg"], images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80", "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80"] },
                    { name: "Mesh Breathable Running Shoes", brand: "Soleste", price: 2799, discount: 20, rating: 4.5, count: 120, size: ["6", "7", "8", "9", "10"], ram: [], weight: ["0.7kg"], images: ["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80", "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80"] },
                    { name: "Classic Italian Leather Loafers", brand: "Atelier Luxe", price: 4499, discount: 15, rating: 4.8, count: 35, size: ["8", "9", "10", "11"], ram: [], weight: ["1.1kg"], images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80"] },
                    { name: "Ankle Suede Desert Boots", brand: "Soleste", price: 3999, discount: 5, rating: 4.4, count: 40, size: ["7", "8", "9", "10", "11"], ram: [], weight: ["1.3kg"], images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80"] },
                    { name: "Chunky Lifestyle Dad Shoes", brand: "Elysian Wear", price: 2999, discount: 0, rating: 4.2, count: 95, size: ["7", "8", "9", "10"], ram: [], weight: ["1.0kg"], images: ["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80"] }
                ],
                "Accessories": [
                    { name: "Premium Saffiano Leather Handbag", brand: "Atelier Luxe", price: 4999, discount: 20, rating: 4.9, count: 25, size: ["One Size"], ram: [], weight: ["0.75kg"], images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80"] },
                    { name: "Acetate Cat-Eye Sunglasses", brand: "Aura Boutique", price: 1499, discount: 10, rating: 4.4, count: 150, size: ["One Size"], ram: [], weight: ["0.08kg"], images: ["https://images.unsplash.com/photo-1608748010899-18f300247112?w=800&q=80"] },
                    { name: "Full-Grain Leather Dress Belt", brand: "Nordic Thread", price: 999, discount: 5, rating: 4.6, count: 200, size: ["S", "M", "L", "XL"], ram: [], weight: ["0.18kg"], images: ["https://images.unsplash.com/photo-1608748010899-18f300247112?w=800&q=80"] },
                    { name: "Minimalist RFID Blocking Wallet", brand: "Nordic Thread", price: 1199, discount: 12, rating: 4.7, count: 180, size: ["One Size"], ram: [], weight: ["0.05kg"], images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80"] },
                    { name: "Pure Cashmere Knit Scarf", brand: "Atelier Luxe", price: 2299, discount: 15, rating: 4.8, count: 40, size: ["One Size"], ram: [], weight: ["0.15kg"], images: ["https://images.unsplash.com/photo-1608748010899-18f300247112?w=800&q=80"] }
                ]
            },
            "Electronics": {
                "Smartphones": [
                    { name: "AeroPhone 14 Pro Max", brand: "NexusTech", price: 89999, discount: 5, rating: 4.8, count: 50, size: ["128GB", "256GB", "512GB"], ram: ["6GB", "8GB"], weight: ["0.22kg"], images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80", "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80"] },
                    { name: "Galaxy Prime Ultra Z", brand: "NexusTech", price: 79999, discount: 8, rating: 4.7, count: 65, size: ["256GB", "512GB"], ram: ["8GB", "12GB"], weight: ["0.24kg"], images: ["https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80"] },
                    { name: "Pixelate Pro 8", brand: "VividPixel", price: 64999, discount: 10, rating: 4.5, count: 80, size: ["128GB", "256GB"], ram: ["8GB"], weight: ["0.19kg"], images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80"] },
                    { name: "LiteTech Zero Gen 5", brand: "Synapse", price: 24999, discount: 15, rating: 4.2, count: 120, size: ["64GB", "128GB"], ram: ["4GB", "6GB"], weight: ["0.18kg"], images: ["https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80"] }
                ],
                "Laptops": [
                    { name: "AeroBook Pro 16", brand: "NexusTech", price: 119999, discount: 7, rating: 4.9, count: 30, size: ["512GB SSD", "1TB SSD"], ram: ["16GB", "32GB"], weight: ["1.6kg"], images: ["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80", "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80"] },
                    { name: "Zenith Slim Ultra 14", brand: "Synapse", price: 74999, discount: 10, rating: 4.6, count: 45, size: ["512GB SSD"], ram: ["16GB"], weight: ["1.2kg"], images: ["https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80"] },
                    { name: "Titan Gaming Machine Alpha", brand: "Quantum", price: 149999, discount: 12, rating: 4.8, count: 15, size: ["1TB SSD", "2TB SSD"], ram: ["32GB", "64GB"], weight: ["2.8kg"], images: ["https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80"] },
                    { name: "ChromBook Essential 11", brand: "VividPixel", price: 19999, discount: 5, rating: 4.0, count: 150, size: ["64GB eMMC"], ram: ["4GB"], weight: ["1.1kg"], images: ["https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80"] }
                ],
                "Audio & Headphones": [
                    { name: "AeroSound ANC Over-Ear Headphones", brand: "AeroSound", price: 14999, discount: 20, rating: 4.7, count: 90, size: ["One Size"], ram: [], weight: ["0.28kg"], images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80", "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80"] },
                    { name: "PureSound Studio TWS Buds", brand: "AeroSound", price: 4999, discount: 15, rating: 4.4, count: 200, size: ["One Size"], ram: [], weight: ["0.05kg"], images: ["https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80"] },
                    { name: "VibeBass Portable Bluetooth Speaker", brand: "AeroSound", price: 3499, discount: 10, rating: 4.3, count: 140, size: ["One Size"], ram: [], weight: ["0.45kg"], images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"] },
                    { name: "Signature Audiophile Studio Monitors", brand: "Quantum", price: 29999, discount: 5, rating: 4.9, count: 20, size: ["Pairs"], ram: [], weight: ["8.5kg"], images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"] }
                ],
                "Cameras": [
                    { name: "VividCapture Mirrorless Camera", brand: "VividPixel", price: 69999, discount: 10, rating: 4.8, count: 25, size: ["Body Only", "With 18-55mm Kit"], ram: [], weight: ["0.55kg"], images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80"] },
                    { name: "Lumix Action Cam X", brand: "Lumix", price: 24999, discount: 15, rating: 4.5, count: 60, size: ["Standard Kit"], ram: [], weight: ["0.12kg"], images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80"] },
                    { name: "ProSteady 3-Axis Gimbal Stabilizer", brand: "Lumix", price: 9999, discount: 8, rating: 4.4, count: 80, size: ["Universal Fit"], ram: [], weight: ["0.65kg"], images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80"] },
                    { name: "Prime 50mm f/1.8 Portrait Lens", brand: "VividPixel", price: 12999, discount: 0, rating: 4.7, count: 40, size: ["Canon Mount", "Sony Mount", "Nikon Mount"], ram: [], weight: ["0.2kg"], images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80"] }
                ],
                "Smart Home": [
                    { name: "Synapse Hub Controller Gen 2", brand: "Synapse", price: 7999, discount: 12, rating: 4.5, count: 70, size: ["Standard"], ram: [], weight: ["0.3kg"], images: ["https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80"] },
                    { name: "EcoGlow Color smart Bulbs Kit", brand: "Synapse", price: 2999, discount: 15, rating: 4.2, count: 150, size: ["3-Pack", "4-Pack"], ram: [], weight: ["0.25kg"], images: ["https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80"] },
                    { name: "GuardEye Smart Outdoor Camera", brand: "VividPixel", price: 11999, discount: 10, rating: 4.6, count: 50, size: ["1-Pack", "2-Pack"], ram: [], weight: ["0.42kg"], images: ["https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80"] },
                    { name: "ThermoControl Adaptive Thermostat", brand: "Synapse", price: 14999, discount: 5, rating: 4.7, count: 35, size: ["Gen 3 Smart"], ram: [], weight: ["0.35kg"], images: ["https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80"] }
                ],
                "Gaming": [
                    { name: "Quantum Console One X", brand: "Quantum", price: 44999, discount: 5, rating: 4.9, count: 40, size: ["1TB Edition"], ram: ["16GB"], weight: ["3.2kg"], images: ["https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80"] },
                    { name: "Vortex Pro Wired Gaming Mouse", brand: "Quantum", price: 3999, discount: 20, rating: 4.6, count: 140, size: ["RGB Premium"], ram: [], weight: ["0.09kg"], images: ["https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80"] },
                    { name: "AeroMech Tactile Keyboard", brand: "AeroSound", price: 6999, discount: 15, rating: 4.7, count: 85, size: ["Blue Switch", "Brown Switch"], ram: [], weight: ["1.1kg"], images: ["https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80"] },
                    { name: "Immersive VR Headset Bundle", brand: "Quantum", price: 34999, discount: 10, rating: 4.8, count: 20, size: ["Pro Headset + Controllers"], ram: [], weight: ["0.68kg"], images: ["https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80"] },
                    { name: "RGB Curved 34-inch Ultrawide Monitor", brand: "VividPixel", price: 32999, discount: 8, rating: 4.7, count: 25, size: ["144Hz WQHD"], ram: [], weight: ["7.2kg"], images: ["https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80"] }
                ]
            },
            "Watches": {
                "Luxury Watches": [
                    { name: "Chronos Executive Gold Chronograph", brand: "Chronos", price: 14999, discount: 10, rating: 4.9, count: 15, size: ["41mm"], ram: [], weight: ["0.15kg"], images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80", "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&q=80"] },
                    { name: "Oceanic Automatic Divers Watch", brand: "Vanguard", price: 18999, discount: 15, rating: 4.8, count: 25, size: ["43mm"], ram: [], weight: ["0.18kg"], images: ["https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&q=80"] },
                    { name: "Horology Hand-Wound Skeleton Dial", brand: "Horology", price: 24999, discount: 5, rating: 4.9, count: 10, size: ["40mm"], ram: [], weight: ["0.14kg"], images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"] },
                    { name: "Grand Reserve Automatic Platinum", brand: "Chronos", price: 34999, discount: 20, rating: 5.0, count: 5, size: ["39mm"], ram: [], weight: ["0.16kg"], images: ["https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&q=80"] },
                    { name: "Elegance Diamond Bezel Quartz", brand: "Chronos", price: 12999, discount: 0, rating: 4.6, count: 30, size: ["36mm"], ram: [], weight: ["0.1kg"], images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"] }
                ],
                "Sport Watches": [
                    { name: "AeroSport Tough Shock Resistant Watch", brand: "AeroSport", price: 4999, discount: 10, rating: 4.5, count: 120, size: ["48mm"], ram: [], weight: ["0.08kg"], images: ["https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80"] },
                    { name: "ApexRacer Chronograph Speed Timer", brand: "Vanguard", price: 6999, discount: 15, rating: 4.4, count: 80, size: ["44mm"], ram: [], weight: ["0.12kg"], images: ["https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80"] },
                    { name: "DiveMaster 200M Waterproof Rubber Watch", brand: "AeroSport", price: 5499, discount: 5, rating: 4.6, count: 90, size: ["45mm"], ram: [], weight: ["0.09kg"], images: ["https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80"] },
                    { name: "CarbonFiber Tactical Field Watch", brand: "Horology", price: 8999, discount: 12, rating: 4.7, count: 40, size: ["43mm"], ram: [], weight: ["0.07kg"], images: ["https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80"] },
                    { name: "Altimeter Compass Outdoor Explorer", brand: "AeroSport", price: 7499, discount: 0, rating: 4.3, count: 65, size: ["46mm"], ram: [], weight: ["0.085kg"], images: ["https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80"] }
                ],
                "Smart Watches": [
                    { name: "ApexSmart Wear Hub Pro v4", brand: "ApexSmart", price: 14999, discount: 8, rating: 4.7, count: 110, size: ["40mm", "44mm"], ram: [], weight: ["0.05kg"], images: ["https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&q=80"] },
                    { name: "FitLife GPS Activity Tracker", brand: "ApexSmart", price: 7999, discount: 20, rating: 4.4, count: 180, size: ["Standard Band"], ram: [], weight: ["0.032kg"], images: ["https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&q=80"] },
                    { name: "TitanHealth ECG Heart Monitor Watch", brand: "ApexSmart", price: 19999, discount: 10, rating: 4.8, count: 50, size: ["42mm", "46mm"], ram: [], weight: ["0.058kg"], images: ["https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&q=80"] },
                    { name: "EliteRunner Triathlon Smart Training Watch", brand: "Vanguard", price: 24999, discount: 5, rating: 4.9, count: 30, size: ["46mm Titanium"], ram: [], weight: ["0.06kg"], images: ["https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&q=80"] },
                    { name: "JuniorFit Kids GPS Locator Watch", brand: "ApexSmart", price: 4499, discount: 0, rating: 4.1, count: 140, size: ["Junior Band"], ram: [], weight: ["0.038kg"], images: ["https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&q=80"] }
                ],
                "Classic Collection": [
                    { name: "Traditional Roman Numeral Dress Watch", brand: "Chronos", price: 5999, discount: 10, rating: 4.6, count: 70, size: ["38mm", "40mm"], ram: [], weight: ["0.06kg"], images: ["https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&q=80"] },
                    { name: "SlimLine Quartz Leather Wristwatch", brand: "Horology", price: 4999, discount: 15, rating: 4.4, count: 90, size: ["38mm"], ram: [], weight: ["0.04kg"], images: ["https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&q=80"] },
                    { name: "Classic Gold Plated Round Dial", brand: "Chronos", price: 8999, discount: 5, rating: 4.7, count: 55, size: ["39mm"], ram: [], weight: ["0.07kg"], images: ["https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&q=80"] },
                    { name: "Retro Square Stainless Steel Case Watch", brand: "Vanguard", price: 7499, discount: 12, rating: 4.5, count: 45, size: ["36mm"], ram: [], weight: ["0.065kg"], images: ["https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&q=80"] },
                    { name: "Heritage Brown Leather Hand-Wind", brand: "Horology", price: 9999, discount: 0, rating: 4.8, count: 25, size: ["40mm"], ram: [], weight: ["0.055kg"], images: ["https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&q=80"] }
                ],
                "Limited Edition": [
                    { name: "Titanium Centenary Chronometer", brand: "Vanguard", price: 45000, discount: 5, rating: 5.0, count: 10, size: ["42mm"], ram: [], weight: ["0.08kg"], images: ["https://images.unsplash.com/photo-1619134778706-7015533a6150?w=800&q=80"] },
                    { name: "Apollo Space Mission Mechanical Watch", brand: "Horology", price: 55000, discount: 10, rating: 4.9, count: 8, size: ["42mm Dome"], ram: [], weight: ["0.095kg"], images: ["https://images.unsplash.com/photo-1619134778706-7015533a6150?w=800&q=80"] },
                    { name: "Monaco Racing Edition Carbon watch", brand: "AeroSport", price: 38000, discount: 15, rating: 4.8, count: 12, size: ["44mm Square"], ram: [], weight: ["0.075kg"], images: ["https://images.unsplash.com/photo-1619134778706-7015533a6150?w=800&q=80"] },
                    { name: "Stealth Black Edition Chronograph", brand: "Chronos", price: 29999, discount: 0, rating: 4.7, count: 20, size: ["43mm"], ram: [], weight: ["0.085kg"], images: ["https://images.unsplash.com/photo-1619134778706-7015533a6150?w=800&q=80"] },
                    { name: "DeepBlue Ceramic Professional Diver 300M", brand: "Vanguard", price: 49000, discount: 20, rating: 4.9, count: 15, size: ["43.5mm"], ram: [], weight: ["0.16kg"], images: ["https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&q=80"] }
                ]
            },
            "Kidz": {
                "Boys Clothing": [
                    { name: "Cotton Dino Graphic Tee & Shorts Set", brand: "KidzWear", price: 899, discount: 10, rating: 4.4, count: 120, size: ["2-3Y", "3-4Y", "4-5Y", "6-7Y"], ram: [], weight: ["0.2kg"], images: ["https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&q=80"] },
                    { name: "Boys Hooded Active Fleece Sweatshirt", brand: "KidzWear", price: 1199, discount: 15, rating: 4.5, count: 80, size: ["4-5Y", "5-6Y", "7-8Y", "9-10Y"], ram: [], weight: ["0.35kg"], images: ["https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&q=80"] },
                    { name: "Boys Comfort Fit Cargo Jeans", brand: "Sprout", price: 1399, discount: 5, rating: 4.2, count: 90, size: ["3-4Y", "5-6Y", "7-8Y", "9-10Y"], ram: [], weight: ["0.3kg"], images: ["https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&q=80"] },
                    { name: "Boys Plaid Flannel Button Down Shirt", brand: "TinyTots", price: 999, discount: 12, rating: 4.3, count: 110, size: ["3-4Y", "4-5Y", "6-7Y", "7-8Y"], ram: [], weight: ["0.18kg"], images: ["https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&q=80"] },
                    { name: "Boys Lightweight Summer Windbreaker", brand: "KidzWear", price: 1599, discount: 20, rating: 4.6, count: 50, size: ["5-6Y", "7-8Y", "9-10Y", "11-12Y"], ram: [], weight: ["0.25kg"], images: ["https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&q=80"] }
                ],
                "Girls Clothing": [
                    { name: "Floral Print Chiffon A-Line Dress", brand: "KidzWear", price: 1199, discount: 10, rating: 4.6, count: 85, size: ["3-4Y", "4-5Y", "5-6Y", "7-8Y"], ram: [], weight: ["0.18kg"], images: ["https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?w=800&q=80"] },
                    { name: "Tulle Layered Party Princess Gown", brand: "Lullaby", price: 1999, discount: 15, rating: 4.8, count: 40, size: ["4-5Y", "5-6Y", "7-8Y", "9-10Y"], ram: [], weight: ["0.3kg"], images: ["https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?w=800&q=80"] },
                    { name: "Girls Soft Knit Cardigan & Leggings", brand: "TinyTots", price: 1499, discount: 5, rating: 4.4, count: 65, size: ["2-3Y", "3-4Y", "4-5Y", "6-7Y"], ram: [], weight: ["0.28kg"], images: ["https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?w=800&q=80"] },
                    { name: "Denim Overall Dress with Striped Tee", brand: "Sprout", price: 1699, discount: 12, rating: 4.5, count: 75, size: ["3-4Y", "5-6Y", "7-8Y"], ram: [], weight: ["0.32kg"], images: ["https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?w=800&q=80"] },
                    { name: "Girls Unicorn Sweatshirt & Joggers Set", brand: "KidzWear", price: 1299, discount: 0, rating: 4.3, count: 90, size: ["3-4Y", "4-5Y", "5-6Y", "7-8Y"], ram: [], weight: ["0.35kg"], images: ["https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?w=800&q=80"] }
                ],
                "Baby Essentials": [
                    { name: "Organic Cotton Baby Rompers 3-Pack", brand: "Lullaby", price: 999, discount: 10, rating: 4.8, count: 200, size: ["Newborn", "0-3M", "3-6M", "6-12M"], ram: [], weight: ["0.25kg"], images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80"] },
                    { name: "Soft Muslin Swaddle Blankets 4-Pack", brand: "Lullaby", price: 1299, discount: 15, rating: 4.7, count: 150, size: ["One Size"], ram: [], weight: ["0.4kg"], images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80"] },
                    { name: "Premium Silicone Teething Toys Trio", brand: "PlayGlow", price: 599, discount: 5, rating: 4.5, count: 300, size: ["One Size"], ram: [], weight: ["0.15kg"], images: ["https://images.unsplash.com/photo-1539683255143-73a6b838b106?w=800&q=80"] },
                    { name: "Baby Diaper Caddy Organizer Bag", brand: "Sprout", price: 899, discount: 0, rating: 4.6, count: 120, size: ["Medium"], ram: [], weight: ["0.3kg"], images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80"] },
                    { name: "Anti-Colic Baby Feeding Bottles Set", brand: "Lullaby", price: 1499, discount: 20, rating: 4.7, count: 100, size: ["Set of 3"], ram: [], weight: ["0.38kg"], images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80"] }
                ],
                "Toys & Games": [
                    { name: "Educational Wooden Stacking Block Cart", brand: "PlayGlow", price: 1499, discount: 12, rating: 4.7, count: 85, size: ["Standard"], ram: [], weight: ["1.5kg"], images: ["https://images.unsplash.com/photo-1539683255143-73a6b838b106?w=800&q=80"] },
                    { name: "Magnetic STEM Building Tiles (60pcs)", brand: "PlayGlow", price: 2499, discount: 15, rating: 4.8, count: 70, size: ["60 Pieces"], ram: [], weight: ["1.8kg"], images: ["https://images.unsplash.com/photo-1539683255143-73a6b838b106?w=800&q=80"] },
                    { name: "Interactive Talking Plush Puppy", brand: "TinyTots", price: 1899, discount: 8, rating: 4.4, count: 110, size: ["10 Inches"], ram: [], weight: ["0.4kg"], images: ["https://images.unsplash.com/photo-1539683255143-73a6b838b106?w=800&q=80"] },
                    { name: "3D Wooden Jigsaw Puzzles 4-Pack", brand: "PlayGlow", price: 799, discount: 5, rating: 4.5, count: 160, size: ["Toddler Size"], ram: [], weight: ["0.6kg"], images: ["https://images.unsplash.com/photo-1539683255143-73a6b838b106?w=800&q=80"] },
                    { name: "Electronic Remote Control Dino Toy", brand: "PlayGlow", price: 2999, discount: 20, rating: 4.6, count: 45, size: ["Large"], ram: [], weight: ["1.10kg"], images: ["https://images.unsplash.com/photo-1539683255143-73a6b838b106?w=800&q=80"] }
                ],
                "School Gear": [
                    { name: "Ergonomic Water-Resistant Kids Backpack", brand: "KidzWear", price: 1899, discount: 10, rating: 4.7, count: 140, size: ["15L"], ram: [], weight: ["0.48kg"], images: ["https://images.unsplash.com/photo-1576016770956-debb63d90029?w=800&q=80"] },
                    { name: "Leak-Proof Double Wall Steel Bento Box", brand: "Sprout", price: 999, discount: 15, rating: 4.5, count: 190, size: ["800ml"], ram: [], weight: ["0.35kg"], images: ["https://images.unsplash.com/photo-1576016770956-debb63d90029?w=800&q=80"] },
                    { name: "BPA-Free Tritan Straw Kids Water Bottle", brand: "Sprout", price: 599, discount: 5, rating: 4.3, count: 250, size: ["500ml"], ram: [], weight: ["0.15kg"], images: ["https://images.unsplash.com/photo-1576016770956-debb63d90029?w=800&q=80"] },
                    { name: "Insulated Lunch Bag with Bottle Holder", brand: "KidzWear", price: 799, discount: 0, rating: 4.4, count: 130, size: ["One Size"], ram: [], weight: ["0.22kg"], images: ["https://images.unsplash.com/photo-1576016770956-debb63d90029?w=800&q=80"] },
                    { name: "Premium Sketching School Art Supply Kit", brand: "PlayGlow", price: 1299, discount: 20, rating: 4.8, count: 60, size: ["72 Items"], ram: [], weight: ["0.75kg"], images: ["https://images.unsplash.com/photo-1576016770956-debb63d90029?w=800&q=80"] }
                ]
            },
            "Home & Living": {
                "Furniture": [
                    { name: "Mid-Century Modern Velvet Armchair", brand: "CasaDeco", price: 14999, discount: 10, rating: 4.8, count: 15, size: ["Standard Lounge"], ram: [], weight: ["18.0kg"], images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80", "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80"] },
                    { name: "Solid Oak Minimalist Coffee Table", brand: "CasaDeco", price: 8999, discount: 15, rating: 4.6, count: 20, size: ["Medium Round"], ram: [], weight: ["12.5kg"], images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80"] },
                    { name: "Ergonomic Mesh Home Office Chair", brand: "ModaLiving", price: 11999, discount: 12, rating: 4.7, count: 35, size: ["Adjustable High-Back"], ram: [], weight: ["15.0kg"], images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80"] },
                    { name: "Industrial Wooden 5-Tier Bookshelf", brand: "CasaDeco", price: 7999, discount: 8, rating: 4.5, count: 25, size: ["Tall Slim"], ram: [], weight: ["22.0kg"], images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80"] },
                    { name: "Modern Nesting Side End Tables Set", brand: "ModaLiving", price: 4499, discount: 0, rating: 4.3, count: 50, size: ["Set of 2"], ram: [], weight: ["7.0kg"], images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80"] }
                ],
                "Décor": [
                    { name: "Handmade Textured Ceramic Vase Duo", brand: "TerraClay", price: 2499, discount: 10, rating: 4.7, count: 65, size: ["Set of 2 Vases"], ram: [], weight: ["2.2kg"], images: ["https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80"] },
                    { name: "Minimalist Framed Abstract Canvas Wall Art", brand: "CasaDeco", price: 3499, discount: 20, rating: 4.8, count: 40, size: ["24x36 inches"], ram: [], weight: ["3.1kg"], images: ["https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80"] },
                    { name: "Woven Macrame Cotton Wall Hanging", brand: "Loom & Thread", price: 1499, discount: 5, rating: 4.4, count: 80, size: ["Medium Decor"], ram: [], weight: ["0.8kg"], images: ["https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80"] },
                    { name: "Scented Natural Soy Wax Candle Trio", brand: "TerraClay", price: 1199, discount: 12, rating: 4.6, count: 150, size: ["3 x 8oz"], ram: [], weight: ["0.95kg"], images: ["https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80"] },
                    { name: "Polished Brass Tabletop Planter stand", brand: "CasaDeco", price: 1899, discount: 0, rating: 4.3, count: 90, size: ["Medium Stand"], ram: [], weight: ["1.2kg"], images: ["https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80"] }
                ],
                "Kitchen": [
                    { name: "Professional Stainless Steel Knife Block Set", brand: "ModaLiving", price: 8999, discount: 15, rating: 4.8, count: 30, size: ["15-Piece Set"], ram: [], weight: ["4.5kg"], images: ["https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80"] },
                    { name: "Premium French Press Coffee Maker", brand: "CasaDeco", price: 1999, discount: 10, rating: 4.6, count: 120, size: ["1000ml (8 Cup)"], ram: [], weight: ["0.65kg"], images: ["https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80"] },
                    { name: "Pre-Seasoned Cast Iron Skillet Set", brand: "TerraClay", price: 2999, discount: 8, rating: 4.7, count: 70, size: ["8-inch & 10-inch"], ram: [], weight: ["5.2kg"], images: ["https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80"] },
                    { name: "Digital Touch Control Kitchen Scales", brand: "ModaLiving", price: 1299, discount: 0, rating: 4.4, count: 140, size: ["High Precision"], ram: [], weight: ["0.3kg"], images: ["https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80"] },
                    { name: "Airtight Glass Food Storage Jars", brand: "Loom & Thread", price: 1599, discount: 20, rating: 4.5, count: 110, size: ["Set of 5"], ram: [], weight: ["2.4kg"], images: ["https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80"] }
                ],
                "Bedding & Bath": [
                    { name: "Organic Egyptian Cotton Sheets Set", brand: "Loom & Thread", price: 3999, discount: 10, rating: 4.9, count: 45, size: ["Queen", "King"], ram: [], weight: ["1.8kg"], images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80"] },
                    { name: "Premium Shredded Memory Foam Pillow", brand: "Loom & Thread", price: 1899, discount: 15, rating: 4.6, count: 110, size: ["Standard Bed"], ram: [], weight: ["1.2kg"], images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80"] },
                    { name: "Plush Zero-Twist Cotton Bath Towels", brand: "Loom & Thread", price: 2499, discount: 5, rating: 4.7, count: 95, size: ["Pack of 4"], ram: [], weight: ["1.6kg"], images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80"] },
                    { name: "Hypoallergenic All-Season Down Comforter", brand: "Loom & Thread", price: 4999, discount: 20, rating: 4.8, count: 25, size: ["Queen", "King"], ram: [], weight: ["2.5kg"], images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80"] },
                    { name: "Luxury Bamboo Fiber Bathmat", brand: "Loom & Thread", price: 1299, discount: 0, rating: 4.3, count: 80, size: ["Medium Bathmat"], ram: [], weight: ["0.65kg"], images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80"] }
                ],
                "Lighting": [
                    { name: "AuraGlow Arc Brass Floor Lamp", brand: "AuraGlow", price: 7999, discount: 12, rating: 4.8, count: 40, size: ["Tall Arc Lamp"], ram: [], weight: ["6.2kg"], images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80"] },
                    { name: "Modern Ceramic Matte Table Lamp", brand: "CasaDeco", price: 3499, discount: 15, rating: 4.5, count: 70, size: ["Medium Bedside"], ram: [], weight: ["1.8kg"], images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80"] },
                    { name: "Vintage Industrial Pendant Cage Light", brand: "AuraGlow", price: 2199, discount: 8, rating: 4.4, count: 90, size: ["Single Pendant"], ram: [], weight: ["1.1kg"], images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80"] },
                    { name: "EcoSmart Adjustable LED Desk Lamp", brand: "ModaLiving", price: 1799, discount: 5, rating: 4.6, count: 125, size: ["Adjustable Desk"], ram: [], weight: ["0.75kg"], images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80"] },
                    { name: "Solar-Powered Outdoor String Lights", brand: "AuraGlow", price: 1499, discount: 20, rating: 4.7, count: 150, size: ["50 Feet String"], ram: [], weight: ["0.9kg"], images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80"] }
                ]
            },
            "Beauty": {
                "Skincare": [
                    { name: "Premium Hyaluronic Acid Serum", brand: "Dermaluxe", price: 1499, discount: 10, rating: 4.8, count: 120, size: ["50ml"], ram: [], weight: ["0.15kg"], images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80"] },
                    { name: "Gentle Foaming Daily Cleanser", brand: "Dermaluxe", price: 999, discount: 15, rating: 4.5, count: 180, size: ["150ml"], ram: [], weight: ["0.22kg"], images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80"] },
                    { name: "Vitamin C Radiance Face Moisturizer", brand: "GlowCo", price: 1299, discount: 5, rating: 4.6, count: 90, size: ["75ml"], ram: [], weight: ["0.18kg"], images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80"] },
                    { name: "Overnight Repair Squalane Eye Cream", brand: "Dermaluxe", price: 1899, discount: 20, rating: 4.7, count: 50, size: ["25ml"], ram: [], weight: ["0.08kg"], images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80"] }
                ],
                "Makeup": [
                    { name: "Vivid Matte Liquid Lip Stain", brand: "GlowCo", price: 899, discount: 10, rating: 4.5, count: 160, size: ["Standard Liquid"], ram: [], weight: ["0.03kg"], images: ["https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80"] },
                    { name: "Hydrating Primer SPF 30 Base", brand: "GlowCo", price: 1199, discount: 15, rating: 4.4, count: 100, size: ["30ml"], ram: [], weight: ["0.05kg"], images: ["https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80"] },
                    { name: "Volumizing Waterproof HD Mascara", brand: "GlowCo", price: 799, discount: 5, rating: 4.6, count: 200, size: ["Standard Stick"], ram: [], weight: ["0.025kg"], images: ["https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80"] },
                    { name: "Fine Line HD Translucent Pressed Powder", brand: "GlowCo", price: 1099, discount: 12, rating: 4.7, count: 85, size: ["Compact Case"], ram: [], weight: ["0.06kg"], images: ["https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80"] }
                ],
                "Fragrances": [
                    { name: "Atelier Blossom Eau De Parfum", brand: "AromaSpa", price: 3499, discount: 15, rating: 4.9, count: 45, size: ["100ml"], ram: [], weight: ["0.35kg"], images: ["https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80"] },
                    { name: "Stealth Noir Intense Cologne", brand: "AromaSpa", price: 3999, discount: 10, rating: 4.8, count: 35, size: ["100ml"], ram: [], weight: ["0.38kg"], images: ["https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80"] },
                    { name: "Citrus breeze Unisex Cologne Spray", brand: "AromaSpa", price: 2799, discount: 5, rating: 4.4, count: 70, size: ["50ml"], ram: [], weight: ["0.22kg"], images: ["https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80"] },
                    { name: "Vanilla Amber Rollerball Perfume", brand: "AromaSpa", price: 1299, discount: 0, rating: 4.6, count: 110, size: ["10ml Travel"], ram: [], weight: ["0.05kg"], images: ["https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80"] }
                ],
                "Hair Care": [
                    { name: "Argan Oil Moisture Repair Shampoo", brand: "SilkLocks", price: 999, discount: 10, rating: 4.6, count: 140, size: ["250ml"], ram: [], weight: ["0.29kg"], images: ["https://images.unsplash.com/photo-1527799822367-a48859a0f66a?w=800&q=80"] },
                    { name: "Restorative Keratin Hair Treatment Mask", brand: "SilkLocks", price: 1499, discount: 15, rating: 4.8, count: 85, size: ["200ml Tub"], ram: [], weight: ["0.24kg"], images: ["https://images.unsplash.com/photo-1527799822367-a48859a0f66a?w=800&q=80"] },
                    { name: "Organic Coconut Dry Hair Serum", brand: "SilkLocks", price: 1199, discount: 5, rating: 4.5, count: 120, size: ["50ml"], ram: [], weight: ["0.16kg"], images: ["https://images.unsplash.com/photo-1527799822367-a48859a0f66a?w=800&q=80"] },
                    { name: "Frizz-Free Herbal Conditioning Spray", brand: "SilkLocks", price: 899, discount: 12, rating: 4.3, count: 150, size: ["150ml Spray"], ram: [], weight: ["0.18kg"], images: ["https://images.unsplash.com/photo-1527799822367-a48859a0f66a?w=800&q=80"] }
                ],
                "Wellness": [
                    { name: "Organic Lavender Sleep Essential Oil", brand: "Vitality", price: 799, discount: 10, rating: 4.8, count: 210, size: ["15ml"], ram: [], weight: ["0.06kg"], images: ["https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80"] },
                    { name: "Ancient Pink Himalayan Bath Salt", brand: "AromaSpa", price: 899, discount: 15, rating: 4.7, count: 130, size: ["500g Tub"], ram: [], weight: ["0.55kg"], images: ["https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80"] },
                    { name: "Multi-Strain Daily Probiotic Capsules", brand: "Vitality", price: 1999, discount: 5, rating: 4.6, count: 80, size: ["60 Veg Caps"], ram: [], weight: ["0.12kg"], images: ["https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80"] },
                    { name: "Organic Cold Pressed Virgin Coconut Oil", brand: "Vitality", price: 699, discount: 0, rating: 4.5, count: 180, size: ["500ml Glass"], ram: [], weight: ["0.6kg"], images: ["https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80"] }
                ]
            },

            // ================== GROCERY PRODUCTS ==================
            "Fruits & Vegetables": {
                "Fresh Fruits": [
                    { name: "Organic Cavendish Bananas", brand: "Fresh Farms", price: 60, discount: 5, rating: 4.8, count: 120, size: ["1kg"], ram: [], weight: ["1.0kg"], images: ["https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&q=80"] },
                    { name: "Fresh Red Delicious Apples", brand: "Orchard Pick", price: 180, discount: 10, rating: 4.5, count: 95, size: ["1kg"], ram: [], weight: ["1.0kg"], images: ["https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=800&q=80"] },
                    { name: "Organic Blueberries Pack", brand: "Berry Delights", price: 299, discount: 20, rating: 4.9, count: 40, size: ["250g"], ram: [], weight: ["0.25kg"], images: ["https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=800&q=80"] },
                    { name: "Sweet Seedless Green Grapes", brand: "Fresh Farms", price: 150, discount: 0, rating: 4.4, count: 85, size: ["500g"], ram: [], weight: ["0.5kg"], images: ["https://images.unsplash.com/photo-1601275868399-45bec4f4cd9d?w=800&q=80"] },
                    { name: "Fresh Ripe Strawberries", brand: "Berry Delights", price: 199, discount: 10, rating: 4.7, count: 60, size: ["200g"], ram: [], weight: ["0.2kg"], images: ["https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800&q=80"] }
                ],
                "Fresh Vegetables": [
                    { name: "Organic Baby Spinach Bunch", brand: "Green Leaf", price: 40, discount: 0, rating: 4.6, count: 150, size: ["250g"], ram: [], weight: ["0.25kg"], images: ["https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&q=80"] },
                    { name: "Ripe Roma Tomatoes", brand: "Orchard Pick", price: 50, discount: 5, rating: 4.3, count: 180, size: ["1kg"], ram: [], weight: ["1.0kg"], images: ["https://images.unsplash.com/photo-1595855759920-86582396756a?w=800&q=80"] },
                    { name: "Fresh Garlic Bulbs Pack", brand: "Spice Route", price: 80, discount: 8, rating: 4.5, count: 110, size: ["250g"], ram: [], weight: ["0.25kg"], images: ["https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=800&q=80"] },
                    { name: "Sweet Baby Carrots Pack", brand: "Green Leaf", price: 70, discount: 0, rating: 4.2, count: 130, size: ["500g"], ram: [], weight: ["0.5kg"], images: ["https://images.unsplash.com/photo-1447175008436-054170c2e979?w=800&q=80"] },
                    { name: "Fresh Broccoli Florets", brand: "Green Leaf", price: 90, discount: 15, rating: 4.7, count: 75, size: ["500g"], ram: [], weight: ["0.5kg"], images: ["https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=800&q=80"] }
                ]
            },
            "Meats & Seafood": {
                "Fresh Poultry": [
                    { name: "Boneless Chicken Breasts", brand: "Butcher's Choice", price: 320, discount: 20, rating: 4.7, count: 60, size: ["500g", "1kg"], ram: [], weight: ["0.5kg"], images: ["https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=800&q=80"] },
                    { name: "Organic Chicken Wings Pack", brand: "Butcher's Choice", price: 280, discount: 10, rating: 4.5, count: 85, size: ["1kg"], ram: [], weight: ["1.0kg"], images: ["https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800&q=80"] },
                    { name: "Fresh Whole Chicken", brand: "Butcher's Choice", price: 450, discount: 15, rating: 4.6, count: 40, size: ["1.5kg"], ram: [], weight: ["1.5kg"], images: ["https://images.unsplash.com/photo-1587593817642-8b9f76a5df7a?w=800&q=80"] },
                    { name: "Premium Chicken Thighs Pack", brand: "Butcher's Choice", price: 340, discount: 5, rating: 4.4, count: 70, size: ["1kg"], ram: [], weight: ["1.0kg"], images: ["https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=800&q=80"] },
                    { name: "Ground Turkey Breast Meat", brand: "Lean Choices", price: 420, discount: 0, rating: 4.3, count: 50, size: ["450g"], ram: [], weight: ["0.45kg"], images: ["https://images.unsplash.com/photo-1587593817642-8b9f76a5df7a?w=800&q=80"] }
                ],
                "Fresh Seafood": [
                    { name: "Fresh Atlantic Salmon Fillet", brand: "Ocean Catch", price: 899, discount: 50, rating: 4.9, count: 30, size: ["250g", "500g"], ram: [], weight: ["0.25kg"], images: ["https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80"] },
                    { name: "Raw Jumbo Peeled Shrimp", brand: "Ocean Catch", price: 650, discount: 60, rating: 4.8, count: 55, size: ["500g"], ram: [], weight: ["0.5kg"], images: ["https://images.unsplash.com/photo-1559737605-de6a255fda3a?w=800&q=80"] },
                    { name: "Fresh Wild Sea Bass Fillet", brand: "Ocean Catch", price: 799, discount: 40, rating: 4.6, count: 25, size: ["300g"], ram: [], weight: ["0.3kg"], images: ["https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=800&q=80"] },
                    { name: "Frozen Cooked Lobster Tails", brand: "Ocean Catch", price: 1499, discount: 100, rating: 4.9, count: 15, size: ["2-Pack"], ram: [], weight: ["0.4kg"], images: ["https://images.unsplash.com/photo-1559737605-de6a255fda3a?w=800&q=80"] },
                    { name: "Premium Blue Crab Cakes", brand: "Ocean Catch", price: 550, discount: 30, rating: 4.5, count: 40, size: ["4-Pack"], ram: [], weight: ["0.35kg"], images: ["https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=800&q=80"] }
                ]
            },
            "Breakfast & Dairy": {
                "Milk & Butter": [
                    { name: "Organic Whole Milk 1L", brand: "Pure Dairy", price: 85, discount: 5, rating: 4.8, count: 200, size: ["1L"], ram: [], weight: ["1.0kg"], images: ["https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&q=80"] },
                    { name: "Creamy Salted Butter Block", brand: "Amulya", price: 110, discount: 0, rating: 4.7, count: 180, size: ["200g"], ram: [], weight: ["0.2kg"], images: ["https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=800&q=80"] },
                    { name: "Organic Unsweetened Almond Milk", brand: "Nature's Own", price: 220, discount: 15, rating: 4.5, count: 110, size: ["1L"], ram: [], weight: ["1.0kg"], images: ["https://images.unsplash.com/photo-1553456558-aff63285bdd1?w=800&q=80"] },
                    { name: "Fresh Double Whipping Cream", brand: "Pure Dairy", price: 160, discount: 10, rating: 4.6, count: 90, size: ["250ml"], ram: [], weight: ["0.25kg"], images: ["https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&q=80"] },
                    { name: "Grass-Fed Ghee Clarified Butter", brand: "Amulya", price: 650, discount: 25, rating: 4.9, count: 75, size: ["500ml"], ram: [], weight: ["0.5kg"], images: ["https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=800&q=80"] }
                ],
                "Eggs & Yogurt": [
                    { name: "Large Free-Range Brown Eggs", brand: "Happy Hens", price: 120, discount: 10, rating: 4.8, count: 150, size: ["6-Pack", "12-Pack"], ram: [], weight: ["0.7kg"], images: ["https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=800&q=80"] },
                    { name: "Authentic Greek Probiotic Yogurt", brand: "Pure Dairy", price: 140, discount: 5, rating: 4.7, count: 140, size: ["450g"], ram: [], weight: ["0.45kg"], images: ["https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80"] },
                    { name: "Low-Fat Strawberry Yogurt Cups", brand: "Pure Dairy", price: 45, discount: 0, rating: 4.3, count: 250, size: ["100g"], ram: [], weight: ["0.1kg"], images: ["https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80"] },
                    { name: "Organic Plain Probiotic Kefir", brand: "Nature's Own", price: 290, discount: 20, rating: 4.6, count: 65, size: ["946ml"], ram: [], weight: ["0.95kg"], images: ["https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=800&q=80"] },
                    { name: "Vanilla Bean Custard Yogurt Set", brand: "Amulya", price: 180, discount: 8, rating: 4.5, count: 80, size: ["4-Pack"], ram: [], weight: ["0.5kg"], images: ["https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80"] }
                ]
            },
            "Beverages": {
                "Soft Drinks": [
                    { name: "Classic Cola Soda Can", brand: "Sip&Soda", price: 40, discount: 0, rating: 4.4, count: 300, size: ["330ml"], ram: [], weight: ["0.35kg"], images: ["https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&q=80"] },
                    { name: "Organic Orange Juice 1L", brand: "Citrus Grove", price: 160, discount: 15, rating: 4.7, count: 110, size: ["1L"], ram: [], weight: ["1.0kg"], images: ["https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=800&q=80"] },
                    { name: "Zero-Sugar Sparkling Spring Water", brand: "Sip&Soda", price: 65, discount: 5, rating: 4.2, count: 240, size: ["500ml"], ram: [], weight: ["0.5kg"], images: ["https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&q=80"] },
                    { name: "Fresh Squeezed Style Lemonade", brand: "Citrus Grove", price: 95, discount: 10, rating: 4.5, count: 130, size: ["500ml"], ram: [], weight: ["0.5kg"], images: ["https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=800&q=80"] },
                    { name: "Cold Pressed Cranberry Tonic Juice", brand: "Citrus Grove", price: 210, discount: 0, rating: 4.3, count: 95, size: ["500ml"], ram: [], weight: ["0.5kg"], images: ["https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=800&q=80"] }
                ],
                "Tea & Coffee": [
                    { name: "French Roast Coffee Beans Bag", brand: "Roaster's Hub", price: 499, discount: 50, rating: 4.9, count: 80, size: ["250g", "500g"], ram: [], weight: ["0.25kg"], images: ["https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=800&q=80"] },
                    { name: "Organic Japanese Green Tea Bags", brand: "Leaf & Pot", price: 249, discount: 20, rating: 4.8, count: 150, size: ["25 Bags"], ram: [], weight: ["0.1kg"], images: ["https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&q=80"] },
                    { name: "English Breakfast Black Tea Loose", brand: "Leaf & Pot", price: 349, discount: 30, rating: 4.6, count: 95, size: ["100g"], ram: [], weight: ["0.1kg"], images: ["https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&q=80"] },
                    { name: "Signature Cold Brew Blend Ground", brand: "Roaster's Hub", price: 549, discount: 40, rating: 4.7, count: 65, size: ["340g"], ram: [], weight: ["0.34kg"], images: ["https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=800&q=80"] },
                    { name: "Instant Espresso Powder Jar", brand: "Roaster's Hub", price: 399, discount: 0, rating: 4.4, count: 120, size: ["100g"], ram: [], weight: ["0.1kg"], images: ["https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=800&q=80"] }
                ]
            },
            "Breads & Bakery": {
                "Fresh Bread": [
                    { name: "Sourdough Artisan Country Loaf", brand: "OvenFresh", price: 140, discount: 10, rating: 4.8, count: 50, size: ["400g"], ram: [], weight: ["0.4kg"], images: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80"] },
                    { name: "Soft Sesame Burger Buns 4-Pack", brand: "OvenFresh", price: 60, discount: 0, rating: 4.4, count: 150, size: ["Set of 4"], ram: [], weight: ["0.24kg"], images: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80"] },
                    { name: "Whole Wheat Classic Sandwich Bread", brand: "Daily Loaf", price: 55, discount: 0, rating: 4.3, count: 200, size: ["450g"], ram: [], weight: ["0.45kg"], images: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80"] },
                    { name: "Fluffy Pita Bread Pockets 5-Pack", brand: "OvenFresh", price: 99, discount: 10, rating: 4.5, count: 90, size: ["Set of 5"], ram: [], weight: ["0.3kg"], images: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80"] },
                    { name: "Gluten-Free Seeded Multi-grain Loaf", brand: "Healthy Crust", price: 240, discount: 20, rating: 4.2, count: 45, size: ["350g"], ram: [], weight: ["0.35kg"], images: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80"] }
                ],
                "Pastries & Muffins": [
                    { name: "French Butter Croissants 2-Pack", brand: "OvenFresh", price: 120, discount: 15, rating: 4.7, count: 80, size: ["2-Pack"], ram: [], weight: ["0.15kg"], images: ["https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80"] },
                    { name: "Fresh Baked Blueberry Muffins", brand: "OvenFresh", price: 160, discount: 10, rating: 4.6, count: 95, size: ["4-Pack"], ram: [], weight: ["0.32kg"], images: ["https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80"] },
                    { name: "Classic Chocolate Chip Cookies", brand: "Sweet Bites", price: 180, discount: 20, rating: 4.5, count: 120, size: ["250g Pack"], ram: [], weight: ["0.25kg"], images: ["https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80"] },
                    { name: "Glazed Cinnamon Rolls Box", brand: "Sweet Bites", price: 299, discount: 30, rating: 4.8, count: 40, size: ["4 Rolls"], ram: [], weight: ["0.45kg"], images: ["https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80"] },
                    { name: "Spiced Apple Pie Traditional 8-inch", brand: "OvenFresh", price: 450, discount: 50, rating: 4.9, count: 25, size: ["1 Whole Pie"], ram: [], weight: ["0.9kg"], images: ["https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80"] }
                ]
            },
            "Frozen Foods": {
                "Frozen Meals": [
                    { name: "Stone-Baked Frozen Pepperoni Pizza", brand: "ItaliaBite", price: 299, discount: 30, rating: 4.6, count: 75, size: ["400g"], ram: [], weight: ["0.4kg"], images: ["https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80"] },
                    { name: "Golden Crispy French Fries Bag", brand: "CrunchyCo", price: 160, discount: 15, rating: 4.4, count: 130, size: ["1kg"], ram: [], weight: ["1.0kg"], images: ["https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&q=80"] },
                    { name: "Frozen Vegetarian Lasagna", brand: "ItaliaBite", price: 249, discount: 20, rating: 4.5, count: 90, size: ["400g"], ram: [], weight: ["0.4kg"], images: ["https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80"] },
                    { name: "Breaded Chicken Nuggets Family Pack", brand: "CrunchyCo", price: 399, discount: 40, rating: 4.7, count: 110, size: ["800g"], ram: [], weight: ["0.8kg"], images: ["https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&q=80"] },
                    { name: "Frozen Steamed Veggie Dumplings", brand: "AsiaExpress", price: 199, discount: 0, rating: 4.3, count: 120, size: ["300g Pack"], ram: [], weight: ["0.3kg"], images: ["https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80"] }
                ],
                "Frozen Desserts": [
                    { name: "Premium Vanilla Bean Ice Cream", brand: "ChillyTreats", price: 250, discount: 25, rating: 4.9, count: 90, size: ["1L Tub"], ram: [], weight: ["0.6kg"], images: ["https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=800&q=80"] },
                    { name: "Classic Ice Cream Sandwiches Box", brand: "ChillyTreats", price: 180, discount: 10, rating: 4.6, count: 100, size: ["6-Pack"], ram: [], weight: ["0.55kg"], images: ["https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=800&q=80"] },
                    { name: "Double Chocolate Ice Cream Bar Set", brand: "ChillyTreats", price: 199, discount: 15, rating: 4.8, count: 85, size: ["4-Pack"], ram: [], weight: ["0.36kg"], images: ["https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=800&q=80"] },
                    { name: "Frozen Organic Mixed Berries Bag", brand: "Berry Delights", price: 349, discount: 0, rating: 4.7, count: 125, size: ["500g"], ram: [], weight: ["0.5kg"], images: ["https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=800&q=80"] },
                    { name: "Frozen Belgian Waffles Regular", brand: "ChillyTreats", price: 220, discount: 20, rating: 4.4, count: 70, size: ["8 Waffles"], ram: [], weight: ["0.4kg"], images: ["https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=800&q=80"] }
                ]
            },
            "Biscuits & Snacks": {
                "Chips & Crackers": [
                    { name: "Sea Salt Potato Chips XL", brand: "SaltyCrunch", price: 99, discount: 10, rating: 4.6, count: 200, size: ["150g"], ram: [], weight: ["0.15kg"], images: ["https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=800&q=80"] },
                    { name: "Cheddar Cheese Baked Crackers", brand: "SaltyCrunch", price: 120, discount: 5, rating: 4.5, count: 180, size: ["200g"], ram: [], weight: ["0.2kg"], images: ["https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=800&q=80"] },
                    { name: "Tortilla Corn Chips Large Bag", brand: "SaltyCrunch", price: 140, discount: 15, rating: 4.4, count: 160, size: ["250g"], ram: [], weight: ["0.25kg"], images: ["https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=800&q=80"] },
                    { name: "Butter Popcorn Microwave Bags", brand: "CrunchyCo", price: 150, discount: 20, rating: 4.3, count: 120, size: ["3-Pack"], ram: [], weight: ["0.3kg"], images: ["https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=800&q=80"] },
                    { name: "Salted Twist Pretzels Bag", brand: "SaltyCrunch", price: 80, discount: 0, rating: 4.1, count: 220, size: ["200g"], ram: [], weight: ["0.2kg"], images: ["https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=800&q=80"] }
                ],
                "Cookies & Biscuits": [
                    { name: "Double Chocolate Chip Cookies", brand: "Sweet Bites", price: 150, discount: 10, rating: 4.8, count: 140, size: ["300g"], ram: [], weight: ["0.3kg"], images: ["https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&q=80"] },
                    { name: "Classic Oatmeal Raisin Biscuits", brand: "Sweet Bites", price: 130, discount: 5, rating: 4.5, count: 110, size: ["250g"], ram: [], weight: ["0.25kg"], images: ["https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&q=80"] },
                    { name: "Crispy Chocolate Cream Wafers", brand: "Sweet Bites", price: 95, discount: 0, rating: 4.4, count: 240, size: ["150g"], ram: [], weight: ["0.15kg"], images: ["https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&q=80"] },
                    { name: "Dry Roasted Salted Almonds Jar", brand: "Nature's Feast", price: 399, discount: 40, rating: 4.8, count: 85, size: ["200g"], ram: [], weight: ["0.2kg"], images: ["https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&q=80"] },
                    { name: "Roasted Salted Cashews Jar", brand: "Nature's Feast", price: 449, discount: 50, rating: 4.7, count: 70, size: ["200g"], ram: [], weight: ["0.2kg"], images: ["https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&q=80"] }
                ]
            },
            "Grocery & Staples": {
                "Rice & Grains": [
                    { name: "Premium Basmati Rice Extra Long", brand: "IndiGate", price: 180, discount: 15, rating: 4.8, count: 150, size: ["1kg", "5kg"], ram: [], weight: ["1.0kg"], images: ["https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80"] },
                    { name: "Durum Wheat Spaghetti Pasta", brand: "ItaliaBite", price: 95, discount: 10, rating: 4.6, count: 160, size: ["500g"], ram: [], weight: ["0.5kg"], images: ["https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=800&q=80"] },
                    { name: "Organic Penne Rigate Pasta", brand: "ItaliaBite", price: 110, discount: 5, rating: 4.5, count: 140, size: ["500g"], ram: [], weight: ["0.5kg"], images: ["https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=800&q=80"] },
                    { name: "Organic Whole Wheat Atta Flour", brand: "Healthy Crust", price: 299, discount: 20, rating: 4.7, count: 120, size: ["5kg"], ram: [], weight: ["5.0kg"], images: ["https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80"] },
                    { name: "Quick Rolled Oats Jumbo pack", brand: "Nature's Own", price: 149, discount: 0, rating: 4.4, count: 180, size: ["1kg"], ram: [], weight: ["1.0kg"], images: ["https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80"] }
                ],
                "Oils & Sauces": [
                    { name: "Extra Virgin Cold Pressed Olive Oil", brand: "Borges", price: 850, discount: 100, rating: 4.9, count: 70, size: ["1L"], ram: [], weight: ["1.0kg"], images: ["https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80"] },
                    { name: "Raw Wildflower Organic Honey", brand: "BeeSweet", price: 299, discount: 30, rating: 4.8, count: 95, size: ["500g"], ram: [], weight: ["0.5kg"], images: ["https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80"] },
                    { name: "Classic Tomato Ketchup Squeeze", brand: "TomatoCo", price: 120, discount: 10, rating: 4.5, count: 200, size: ["500g"], ram: [], weight: ["0.5kg"], images: ["https://images.unsplash.com/photo-1607305387299-a3d9611cd46f?w=800&q=80"] },
                    { name: "Natural Brewed Low-Sodium Soy Sauce", brand: "AsiaExpress", price: 160, discount: 5, rating: 4.4, count: 140, size: ["250ml"], ram: [], weight: ["0.25kg"], images: ["https://images.unsplash.com/photo-1607305387299-a3d9611cd46f?w=800&q=80"] },
                    { name: "Pure Cold Pressed Canola Cooking Oil", brand: "Borges", price: 210, discount: 15, rating: 4.3, count: 110, size: ["1L"], ram: [], weight: ["1.0kg"], images: ["https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80"] }
                ]
            }
        };

        // Programmatically fill product rows
        let totalCreated = 0;
        let isFeaturedCounter = 0;
        const productsToInsert = [];

        for (const catName in productsDefinitions) {
            const parentCat = categoriesMap[catName];
            const catSubDefinitions = productsDefinitions[catName];

            for (const subcatName in catSubDefinitions) {
                const subCatDoc = subcategoriesMap[catName][subcatName];
                const list = catSubDefinitions[subcatName];

                for (const p of list) {
                    // Feature exactly 2-3 products per category for home display
                    // The home page features should show fashion/watches/kidz etc.
                    const shouldFeature = (isFeaturedCounter % 4 === 0 || catName === "Fashion" || catName === "Watches" || catName === "Kidz");
                    isFeaturedCounter++;

                    const richDescription = generateDescription(catName, subcatName, p.name, p.brand);

                    productsToInsert.push({
                        name: p.name,
                        description: richDescription,
                        brand: p.brand,
                        price: p.price,
                        discount: p.discount,
                        catName: catName,
                        subCat: subcatName,
                        productRam: p.ram,
                        productSize: p.size,
                        productWeight: p.weight,
                        category: parentCat._id,
                        subcategory: subCatDoc._id,
                        countInstock: p.count,
                        images: p.images,
                        rating: p.rating,
                        isFeatured: shouldFeature
                    });
                }
            }
        }

        console.log(`Prepared ${productsToInsert.length} products to insert.`);

        // 5. Bulk insert products
        const savedProductsList = await Product.insertMany(productsToInsert);
        console.log(`Successfully seeded ${savedProductsList.length} products to database!`);

        console.log("\nSeeding Completed Successfully! Summary:");
        console.log(`- Categories: ${Object.keys(categoriesMap).length}`);
        console.log(`- SubCategories: ${subcatCount}`);
        console.log(`- Products: ${savedProductsList.length}`);

        mongoose.connection.close();
        console.log("Database connection closed. Exiting.");
        process.exit(0);
    } catch (err) {
        console.error("Seeding Error:", err);
        mongoose.connection.close();
        process.exit(1);
    }
};

seedData();
