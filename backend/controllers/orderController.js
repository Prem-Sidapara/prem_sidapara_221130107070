const OrderModel = require('../models/orderModel');
const { ProductModel } = require('../models/productModel');

const orderController = {
  // Create new order (checkout)
  createOrder: async (req, res) => {
    try {
      const { items } = req.body; // items: [{ productId, quantity }]
      const userId = req.user.id;

      // Validation
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Cart items are required' });
      }

      // Fetch products and calculate total
      let total = 0;
      const orderItems = [];

      for (const item of items) {
        const product = await ProductModel.getById(item.productId);
        
        if (!product) {
          return res.status(404).json({ 
            error: `Product ${item.productId} not found` 
          });
        }

        if (product.stock < item.quantity) {
          return res.status(400).json({ 
            error: `Insufficient stock for ${product.name}` 
          });
        }

        const itemTotal = product.price * item.quantity;
        total += itemTotal;

        orderItems.push({
          productId: product._id.toString(),
          quantity: item.quantity,
          priceAtPurchase: product.price
        });

        // Update stock
        await ProductModel.update(product._id, {
          stock: product.stock - item.quantity
        });
      }

      // Create order in SQL
      const orderId = await OrderModel.create(userId, total);

      // Add order items
      await OrderModel.addItems(orderId, orderItems);

      res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        data: {
          orderId,
          total,
          itemCount: items.length
        }
      });
    } catch (error) {
      console.error('Create order error:', error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  },

  // Get user's orders
  getUserOrders: async (req, res) => {
    try {
      const userId = req.user.id;
      const orders = await OrderModel.getUserOrders(userId);

      // Group order items by order ID
      const groupedOrders = {};
      
      orders.forEach(row => {
        if (!groupedOrders[row.id]) {
          groupedOrders[row.id] = {
            id: row.id,
            total: row.total,
            createdAt: row.createdAt,
            items: []
          };
        }
        
        if (row.productId) {
          groupedOrders[row.id].items.push({
            productId: row.productId,
            quantity: row.quantity,
            priceAtPurchase: row.priceAtPurchase
          });
        }
      });

      const ordersList = Object.values(groupedOrders);

      res.json({
        success: true,
        data: ordersList
      });
    } catch (error) {
      console.error('Get orders error:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  }
};

module.exports = orderController;