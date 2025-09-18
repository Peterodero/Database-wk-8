// controllers/orderController.js
const Order = require('../models/order');
const Product = require('../models/product');
const db = require('../config/database');

const createOrder = (req, res) => {
    const { customer_name, customer_email, items } = req.body;
    
    if (!customer_name || !customer_email || !items || !Array.isArray(items)) {
        return res.status(400).json({ 
            error: 'Customer name, email, and items array are required' 
        });
    }

    // Calculate total amount
    let total_amount = 0;
    items.forEach(item => {
        total_amount += item.quantity * item.price;
    });

    db.serialize(() => {
        // Create order
        Order.create({ customer_name, customer_email, total_amount }, (err, order) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            // Add order items
            let itemsAdded = 0;
            items.forEach((item, index) => {
                Order.addOrderItem({
                    order_id: order.id,
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price: item.price
                }, (err) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }
                    
                    itemsAdded++;
                    if (itemsAdded === items.length) {
                        res.status(201).json(order);
                    }
                });
            });
        });
    });
};

const getOrders = (req, res) => {
    Order.getAll((err, orders) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(orders);
    });
};

const getOrder = (req, res) => {
    const { id } = req.params;
    
    Order.getById(id, (err, order) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(order);
    });
};

const updateOrderStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    Order.updateStatus(id, status, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json({ message: 'Order status updated successfully' });
    });
};

const deleteOrder = (req, res) => {
    const { id } = req.params;
    
    Order.delete(id, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json({ message: 'Order deleted successfully' });
    });
};

module.exports = {
    createOrder,
    getOrders,
    getOrder,
    updateOrderStatus,
    deleteOrder
};