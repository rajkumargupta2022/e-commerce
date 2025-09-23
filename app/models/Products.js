import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  febricCategory: { type: String, required: true },
  price: { type: Number, required: true },
  size: { type: String, required: true },
  images: { type: [String]},
  quantity: { type: Number,required: true },
  description: { type: String }
});

// ✅ Always use the same name ("Product") to avoid OverwriteModelError
const Product = mongoose.models.Product || mongoose.model('Products', ProductSchema);

export default Product;
