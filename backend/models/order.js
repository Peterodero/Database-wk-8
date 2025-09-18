// models/Order.js
const db = require('../config/database');

const Order = {
    create: (order, callback) => {
        const { customer_name, customer_email, total_amount, status = 'pending' } = order;
        const query = `
            INSERT INTO orders (customer_name, customer_email, total_amount, status) 
            VALUES (?, ?, ?, ?)
        `;
        db.run(query, [customer_name, customer_email, total_amount, status], function(err) {
            callback(err, { id: this.lastID, ...order });
        });
    },

    getAll: (callback) => {
        const query = `
            SELECT o.*, 
                   GROUP_CONCAT(oi.product_id || ':' || oi.quantity || ':' || oi.price) as items
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            GROUP BY o.id
            ORDER BY o.created_at DESC
        `;
        db.all(query, [], callback);
    },

    getById: (id, callback) => {
        const query = `
            SELECT o.*, 
                   json_group_array(
                       json_object(
                           'product_id', oi.product_id,
                           'quantity', oi.quantity,
                           'price', oi.price
                       )
                   ) as items
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            WHERE o.id = ?
            GROUP BY o.id
        `;
        db.get(query, [id], callback);
    },

    updateStatus: (id, status, callback) => {
        const query = `UPDATE orders SET status = ? WHERE id = ?`;
        db.run(query, [status, id], function(err) {
            callback(err, { changes: this.changes });
        });
    },

    delete: (id, callback) => {
        const query = `DELETE FROM orders WHERE id = ?`;
        db.run(query, [id], function(err) {
            callback(err, { changes: this.changes });
        });
    },

    addOrderItem: (orderItem, callback) => {
        const { order_id, product_id, quantity, price } = orderItem;
        const query = `
            INSERT INTO order_items (order_id, product_id, quantity, price) 
            VALUES (?, ?, ?, ?)
        `;
        db.run(query, [order_id, product_id, quantity, price], function(err) {
            callback(err, { id: this.lastID, ...orderItem });
        });
    }
};

module.exports = Order;