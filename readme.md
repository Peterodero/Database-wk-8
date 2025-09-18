# Product Order API

A complete CRUD API for managing products and orders built with Node.js, Express, and SQLite.

## Features
- ✅ Create, read, update, delete products
- ✅ Create, read, update order status, delete orders
- ✅ Manage product inventory
- ✅ Order management with items
- ✅ RESTful API design
- ✅ SQLite database with automatic setup
- ✅ CORS enabled
- ✅ Error handling

## Installation

1. **Clone the repository:**

    git clone <repo-url>
    cd database-wk-8

 ## Running project 
  in terminal  
    cd backend
    npm install
    npm start

   ** open another terminal **

    cd frontend
    npm install
    npm run dev
    Copy the url and paste in the browser

    You can then interact with the UI.The data is fetched from the database


 # Viewing the databse
  ## On macOS (with Homebrew)
brew install sqlite

  ## On Ubuntu/Debian
 sudo apt-get install sqlite3

 ## On Windows
  Download from: https://sqlite.org/download.html   


 ## Navigate to your project directory
cd database-wk-8

## Open the database
sqlite3 database.sqlite

## Once in SQLite CLI, run these commands:
.tables                 # Show all tables
.schema                 # Show database schema
SELECT * FROM products; # View all products
SELECT * FROM orders;   # View all orders
SELECT * FROM order_items; # View order items

## To exit SQLite CLI
.quit
