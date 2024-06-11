const faker = require('faker');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

// Generate Suppliers
function generateSuppliers(count) {
    let suppliers = [];
    for (let i = 0; i < count; i++) {
        let supplier = {
            sup_id: uuidv4(),
            sup_name: faker.company.companyName().substring(0, 20),
            sup_address: faker.address.streetAddress().substring(0, 255),
            sup_contact: faker.phone.phoneNumber().substring(0, 15)
        };
        suppliers.push(supplier);
    }
    return suppliers;
}

// Generate Users
function generateUsers(count) {
    let users = [];
    for (let i = 0; i < count; i++) {
        let user = {
            us_id: uuidv4(),
            us_name: faker.name.findName().substring(0, 20),
            us_address: faker.address.streetAddress().substring(0, 255),
            us_contact: faker.phone.phoneNumber().substring(0, 15),
            us_province: faker.address.state().substring(0, 20),
            us_city: faker.address.city().substring(0, 20),
            us_postal_code: faker.address.zipCode().substring(0, 5),
            us_rewards: faker.random.number({ min: 1, max: 5 }),
            us_role: faker.random.number({ min: 1, max: 1 })
        };
        users.push(user);
    }
    return users;
}

// Generate Payments
function generatePayments(count) {
    let payments = [];
    for (let i = 0; i < count; i++) {
        let payment = {
            p_id: uuidv4(),
            p_date: faker.date.past().toISOString().slice(0, 19).replace('T', ' '),
            p_method: faker.finance.transactionType().substring(0, 20)
        };
        payments.push(payment);
    }
    return payments;
}

// Generate Shipments
function generateShipments(count) {
    let shipments = [];
    for (let i = 0; i < count; i++) {
        let shipment = {
            ship_id: uuidv4(),
            ship_name: faker.company.companyName().substring(0, 255),
            ship_date: faker.date.future().toISOString().slice(0, 10),
            ship_address: faker.address.streetAddress().substring(0, 255),
            ship_contact: faker.phone.phoneNumber().substring(0, 15),
            ship_postal_code: faker.address.zipCode().substring(0, 5),
            ship_status: faker.random.boolean()
        };
        shipments.push(shipment);
    }
    return shipments;
}

// Generate Products Categories
function generateProductCategories(count) {
    let categories = [];
    for (let i = 0; i < count; i++) {
        let category = {
            cat_id: uuidv4(),
            cat_name: faker.commerce.department().substring(0, 20),
            cat_description: faker.lorem.sentence().substring(0, 255)
        };
        categories.push(category);
    }
    return categories;
}

// Generate Products
function generateProducts(count, suppliers, categories) {
    let products = [];
    for (let i = 0; i < count; i++) {
        let product = {
            pr_id: uuidv4(),
            pr_name: faker.commerce.productName().substring(0, 20),
            pr_price: faker.random.number({ min: 1, max: 1000 }),
            pr_description: faker.lorem.sentence().substring(0, 255),
            pr_quantity: faker.random.number({ min: 1, max: 100 }),
            pr_images: '\\x' + Buffer.from(faker.image.imageUrl()).toString('hex'), // Assuming image URLs are converted to binary
            suppliers_sup_id: suppliers[faker.random.number({ min: 0, max: suppliers.length - 1 })].sup_id,
            products_categories_cat_id: categories[faker.random.number({ min: 0, max: categories.length - 1 })].cat_id
        };
        products.push(product);
    }
    return products;
}

// Generate Orders
function generateOrders(count, users, payments, shipments) {
    let orders = [];
    for (let i = 0; i < count; i++) {
        let order = {
            or_id: uuidv4(),
            or_date: faker.date.recent().toISOString().slice(0, 19).replace('T', ' '),
            or_total_price: faker.random.number({ min: 1, max: 10000 }),
            shipments_ship_id: shipments[faker.random.number({ min: 0, max: shipments.length - 1 })].ship_id,
            users_us_id: users[faker.random.number({ min: 0, max: users.length - 1 })].us_id,
            payments_p_id: payments[faker.random.number({ min: 0, max: payments.length - 1 })].p_id
        };
        orders.push(order);
    }
    return orders;
}

// Generate Products Orders
function generateProductsOrders(count, orders, products) {
    let productsOrders = [];
    for (let i = 0; i < count; i++) {
        let productOrder = {
            orders_or_id: orders[faker.random.number({ min: 0, max: orders.length - 1 })].or_id,
            products_pr_id: products[faker.random.number({ min: 0, max: products.length - 1 })].pr_id,
            or_total_amount: faker.random.number({ min: 1, max: 100 })
        };
        productsOrders.push(productOrder);
    }
    return productsOrders;
}

// Generate Products Reviews
function generateProductsReviews(count, products) {
    let reviews = [];
    for (let i = 0; i < count; i++) {
        let review = {
            pr_r_id: uuidv4(),
            pr_r_rating: faker.random.number({ min: 1, max: 5 }),
            pr_r_review: faker.lorem.paragraph(),
            pr_r_images: '\\x' + Buffer.from(faker.image.imageUrl()).toString('hex'), // Assuming image URLs are converted to binary
            products_pr_id: products[faker.random.number({ min: 0, max: products.length - 1 })].pr_id
        };
        reviews.push(review);
    }
    return reviews;
}

// Generate Products Orders Products Reviews
function generateProductsOrdersProductsReviews(count, productsOrders, reviews) {
    let productsOrdersProductsReviews = [];
    for (let i = 0; i < count; i++) {
        let popReview = {
            products_orders_orders_or_id: productsOrders[faker.random.number({ min: 0, max: productsOrders.length - 1 })].orders_or_id,
            products_orders_products_pr_id: productsOrders[faker.random.number({ min: 0, max: productsOrders.length - 1 })].products_pr_id,
            products_reviews_pr_r_id: reviews[faker.random.number({ min: 0, max: reviews.length - 1 })].pr_r_id
        };
        productsOrdersProductsReviews.push(popReview);
    }
    return productsOrdersProductsReviews;
}

// Function to generate SQL insert statements
function generateInsertStatements(tableName, data) {
    return data.map(row => {
        const columns = Object.keys(row).join(', ');
        const values = Object.values(row).map(value => 
            typeof value === 'string' && value.startsWith('\\x') ? value : `'${value}'`
        ).join(', ');
        return `INSERT INTO ${tableName} (${columns}) VALUES (${values});`;
    }).join('\n');
}

// Generate all data
const suppliers = generateSuppliers(1000);
const users = generateUsers(10000);
const payments = generatePayments(10000);
const shipments = generateShipments(1000);
const productCategories = generateProductCategories(10);
const products = generateProducts(200, suppliers, productCategories);
const orders = generateOrders(200, users, payments, shipments);
const productsOrders = generateProductsOrders(500, orders, products);
const productsReviews = generateProductsReviews(100, products);
const productsOrdersProductsReviews = generateProductsOrdersProductsReviews(100, productsOrders, productsReviews);

// Generate SQL insert statements for all tables
const insertStatements = [
    generateInsertStatements('suppliers', suppliers),
    generateInsertStatements('users', users),
    generateInsertStatements('payments', payments),
    generateInsertStatements('shipments', shipments),
].join('\n\n');

// Write insert statements to file
fs.writeFile('seedresults.txt', insertStatements, (err) => {
    if (err) {
        console.error('Error writing to file', err);
    } else {
        console.log('Insert statements written to seedresults.txt');
    }
});
