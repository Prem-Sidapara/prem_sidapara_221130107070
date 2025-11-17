const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Admin only routes
router.post('/', auth, roleCheck('admin'), productController.createProduct);
router.put('/:id', auth, roleCheck('admin'), productController.updateProduct);
router.delete('/:id', auth, roleCheck('admin'), productController.deleteProduct);

module.exports = router;