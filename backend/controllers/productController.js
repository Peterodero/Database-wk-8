// controllers/productController.js
const Product = require('../models/product');

const createProduct = (req, res) => {
    const { name, description, price, stock_quantity } = req.body;
    
    if (!name || !price) {
        return res.status(400).json({ error: 'Name and price are required' });
    }

    Product.create({ name, description, price, stock_quantity }, (err, product) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json(product);
    });
};

const getProducts = (req, res) => {
    Product.getAll((err, products) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(products);
    });
};

const getProduct = (req, res) => {
    const { id } = req.params;
    
    Product.getById(id, (err, product) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    });
};

const updateProduct = (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock_quantity } = req.body;
    
    if (!name || !price) {
        return res.status(400).json({ error: 'Name and price are required' });
    }

    Product.update(id, { name, description, price, stock_quantity }, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product updated successfully' });
    });
};

const deleteProduct = (req, res) => {
    const { id } = req.params;
    
    Product.delete(id, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    });
};

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
};