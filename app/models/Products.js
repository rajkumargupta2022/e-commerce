import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  febricCategory: { type: String, required: true },
  price: { type: Number, required: true },
  size: { type: String, required: true },
  image1: { type: String, required: true }, // make false if optional
  image2: { type: String },
  description: { type: String }
});

// ✅ Always use the same name ("Product") to avoid OverwriteModelError
const Product = mongoose.models.Product || mongoose.model('Products', ProductSchema);

export default Product;
