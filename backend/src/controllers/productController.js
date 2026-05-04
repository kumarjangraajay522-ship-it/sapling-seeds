import Product from '../models/Product.js';

// GET /api/v1/products — public, used by frontend too
export const getProducts = async (req, res) => {
  try {
    const { category, limit = 50, page = 1, active = 'true' } = req.query;
    const filter = {};
    if (active === 'true') filter.isActive = true;
    if (category) filter.category = new RegExp(category, 'i');

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).limit(Number(limit)).skip(skip),
      Product.countDocuments(filter),
    ]);

    res.json({ success: true, count: total, data: products });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/v1/products/:id
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/v1/products — admin only
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// PUT /api/v1/products/:id — admin only
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// DELETE /api/v1/products/:id — admin only
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/v1/admin/stats — dashboard summary
export const getDashboardStats = async (req, res) => {
  try {
    const [totalProducts, lowStock, outOfStock] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({ isActive: true, stock: { $gt: 0, $lte: 10 } }),
      Product.countDocuments({ isActive: true, stock: 0 }),
    ]);

    res.json({
      success: true,
      data: {
        totalProducts,
        lowStock,
        outOfStock,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
