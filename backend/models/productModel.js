const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  description: {
    type: String,
    default: ''
  },
  stock: {
    type: Number,
    default: 0
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Update timestamp on save
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const ProductModel = {
  // Get all products with sorting and pagination
  getAll: async (page = 1, limit = 10, sortOrder = 'desc', category = null, search = null) => {
    const skip = (page - 1) * limit;
    const sort = { price: sortOrder === 'asc' ? 1 : -1 };
    
    const query = {};
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };
    
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    const total = await Product.countDocuments(query);
    
    return {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  },

  // Get product by ID
  getById: async (id) => {
    return await Product.findById(id);
  },

  // Get product by SKU
  getBySku: async (sku) => {
    return await Product.findOne({ sku });
  },

  // Create product
  create: async (productData) => {
    const product = new Product(productData);
    return await product.save();
  },

  // Update product
  update: async (id, productData) => {
    productData.updatedAt = Date.now();
    return await Product.findByIdAndUpdate(id, productData, { new: true });
  },

  // Delete product
  delete: async (id) => {
    return await Product.findByIdAndDelete(id);
  },

  // Get categories (for reports)
  getCategorySales: async () => {
    // This will be used with order_items data
    const categories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          totalProducts: { $sum: 1 },
          avgPrice: { $avg: '$price' }
        }
      },
      { $sort: { totalProducts: -1 } }
    ]);
    return categories;
  }
};

const Product = mongoose.model('Product', productSchema);

module.exports = { Product, ProductModel };