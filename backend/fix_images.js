import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const productSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.model('Product', productSchema);

const URI = process.env.MONGODB_URI;

mongoose.connect(URI).then(async () => {
    console.log("Connected to MongoDB. Fixing database image references...");
    const nameMap = {
        'Herbal Neem Combs': 'neemrubycomb',
        'Seed Pen': 'seedpen',
        'Wooden Pen': 'penWithBox',
        'Adult Toothbrush': 'bottomPaintCharcoal',
        'KIDS Toothbrush': 'kidsCharcoal'
    };
    
    let updatedCount = 0;
    const products = await Product.find({});
    for (const p of products) {
        const doc = p.toObject();
        // If the name exactly matches one of our known products, lock its image to the correct asset key!
        if (nameMap[doc.name] && doc.image !== nameMap[doc.name]) {
            console.log(`Fixing [${doc.name}]: changing image to '${nameMap[doc.name]}'`);
            await Product.updateOne({ _id: p._id }, { $set: { image: nameMap[doc.name] } });
            updatedCount++;
        }
    }
    console.log(`Done. Fixed ${updatedCount} products.`);
    process.exit(0);
}).catch(err => {
    console.error("DB connection error:", err);
    process.exit(1);
});
