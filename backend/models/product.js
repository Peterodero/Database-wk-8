// models/Product.js
const db = require('../config/database');

const Product = {
    create: (product, callback) => {
        const { name, description, price, stock_quantity } = product;
        const query = `
            INSERT INTO products (name, description, price, stock_quantity) 
            VALUES (?, ?, ?, ?)
        `;
        db.run(query, [name, description, price, stock_quantity], function(err) {
            callback(err, { id: this.lastID, ...product });
        });
    },

    getAll: (callback) => {
        const query = `SELECT * FROM products ORDER BY created_at DESC`;
        db.all(query, [], callback);
    },

    getById: (id, callback) => {
        const query = `SELECT * FROM products WHERE id = ?`;
        db.get(query, [id], callback);
    },

    update: (id, product, callback) => {
        const { name, description, price, stock_quantity } = product;
        const query = `
            UPDATE products 
            SET name = ?, description = ?, price = ?, stock_quantity = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        `;
        db.run(query, [name, description, price, stock_quantity, id], function(err) {
            callback(err, { changes: this.changes });
        });
    },

    delete: (id, callback) => {
        const query = `DELETE FROM products WHERE id = ?`;
        db.run(query, [id], function(err) {
            callback(err, { changes: this.changes });
        });
    },

    updateStock: (id, quantity, callback) => {
        const query = `UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?`;
        db.run(query, [quantity, id], callback);
    }
};

module.exports = Product;