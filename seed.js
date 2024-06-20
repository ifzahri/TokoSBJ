const faker = require("faker");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const bcrypt = require("bcrypt");

// Generate Suppliers
function generateSuppliers(count) {
  let suppliers = [];
  for (let i = 0; i < count; i++) {
    let supplier = {
      sup_id: uuidv4(),
      sup_name: faker.company.companyName().substring(0, 20),
      sup_address: faker.address.streetAddress().substring(0, 255),
      sup_contact: faker.phone.phoneNumber().substring(0, 15),
    };
    suppliers.push(supplier);
  }
  console.log("Suppliers generated");
  return suppliers;
}

// Generate Users
function generateUsers(count) {
  let users = [];
  for (let i = 0; i < count; i++) {
    let user = {
      us_id: uuidv4(),
      us_name: faker.name.findName().substring(0, 20),
      us_birthday: faker.date
        .between("1974-01-01", "2006-12-31")
        .toISOString()
        .slice(0, 10),
      us_address: faker.address.streetAddress().substring(0, 255),
      us_contact: faker.phone.phoneNumber().substring(0, 15),
      us_province: faker.address.state().substring(0, 20),
      us_city: faker.address.city().substring(0, 20),
      us_postal_code: faker.address.zipCode().substring(0, 5),
      us_rewards: faker.datatype.number({ min: 1, max: 5 }),
      us_role: faker.datatype.number({ min: 1, max: 1 }),
      us_password: bcrypt.hashSync(faker.internet.password(), 10), // hashed password
      us_isLogin: faker.datatype.boolean(),
    };
    users.push(user);
  }
  console.log("Users generated");
  return users;
}

// Generate Payments
function generatePayments(count) {
  let payments = [];
  for (let i = 0; i < count; i++) {
    let payment = {
      p_id: uuidv4(),
      p_date: faker.date.past().toISOString().slice(0, 19).replace("T", " "),
      p_method: faker.finance.transactionType().substring(0, 20),
    };
    payments.push(payment);
  }
  console.log("Payments generated");
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
      ship_status: faker.datatype.boolean(),
    };
    shipments.push(shipment);
  }
  console.log("Shipments generated");
  return shipments;
}

// Generate Product Categories
function generateProductCategories(count) {
  let categories = [];
  for (let i = 0; i < count; i++) {
    let category = {
      cat_id: uuidv4(),
      cat_name: faker.commerce.department().substring(0, 20),
      cat_description: faker.lorem.sentence().substring(0, 255),
    };
    categories.push(category);
  }
  console.log("Product Categories generated");
  return categories;
}

// Generate Products
function generateProducts(count, suppliers, categories) {
  let products = [];
  for (let i = 0; i < count; i++) {
    let product = {
      pr_id: uuidv4(),
      pr_name: faker.commerce.productName().substring(0, 20),
      pr_price: faker.datatype.number({ min: 1, max: 1000 }),
      pr_description: faker.lorem.sentence().substring(0, 255),
      pr_quantity: faker.datatype.number({ min: 1, max: 100 }),
      pr_images: "\\x" + Buffer.from(faker.image.imageUrl()).toString("hex"), // Assuming image URLs are converted to binary
      suppliers_sup_id:
        suppliers[faker.datatype.number({ min: 0, max: suppliers.length - 1 })]
          .sup_id,
      products_categories_cat_id:
        categories[
          faker.datatype.number({ min: 0, max: categories.length - 1 })
        ].cat_id,
    };
    products.push(product);
  }
  console.log("Products generated");
  return products;
}

// Generate Orders
function generateOrders(count, users, payments, shipments, vouchers) {
  let orders = [];
  for (let i = 0; i < count; i++) {
    let order = {
      or_id: uuidv4(),
      or_date: faker.date.recent().toISOString().slice(0, 19).replace("T", " "),
      or_total_price: faker.datatype.number({ min: 1, max: 10000 }),
      shipments_ship_id:
        shipments[faker.datatype.number({ min: 0, max: shipments.length - 1 })]
          .ship_id,
      users_us_id:
        users[faker.datatype.number({ min: 0, max: users.length - 1 })].us_id,
      payments_p_id:
        payments[faker.datatype.number({ min: 0, max: payments.length - 1 })]
          .p_id,
      voucher_id:
        vouchers[faker.datatype.number({ min: 0, max: vouchers.length - 1 })]
          .voucher_id,
    };
    orders.push(order);
  }
  console.log("Orders generated");
  return orders;
}

// Generate Products Orders
function generateProductsOrders(count, orders, products) {
  let productsOrders = [];
  for (let i = 0; i < count; i++) {
    let productOrder = {
      orders_or_id:
        orders[faker.datatype.number({ min: 0, max: orders.length - 1 })].or_id,
      products_pr_id:
        products[faker.datatype.number({ min: 0, max: products.length - 1 })]
          .pr_id,
      or_total_amount: faker.datatype.number({ min: 1, max: 100 }),
    };
    productsOrders.push(productOrder);
  }
  console.log("Products Orders generated");
  return productsOrders;
}

// Generate Products Reviews
function generateProductsReviews(count, products) {
  let reviews = [];
  for (let i = 0; i < count; i++) {
    let review = {
      pr_r_id: uuidv4(),
      pr_r_rating: faker.datatype.number({ min: 1, max: 5 }),
      pr_r_review: faker.lorem.paragraph(),
      pr_r_images: "\\x" + Buffer.from(faker.image.imageUrl()).toString("hex"), // Assuming image URLs are converted to binary
      products_pr_id:
        products[faker.datatype.number({ min: 0, max: products.length - 1 })]
          .pr_id,
    };
    reviews.push(review);
  }
  console.log("Products Reviews generated");
  return reviews;
}

// Generate Vouchers
function generateVouchers(count) {
  let vouchers = [];
  for (let i = 0; i < count; i++) {
    let voucher = {
      voucher_id: uuidv4(),
      voucher_code: faker.random.alphaNumeric(10),
      discount_amount: faker.datatype.number({ min: 5000, max: 10000 }),
      min_purchase: faker.datatype.number({ min: 50000, max: 150000 }),
      min_reward: faker.datatype.number({ min: 1, max: 5 }),
      max_discount: faker.datatype.number({ min: 5000, max: 10000 }),
      expiration_date: faker.date.future().toISOString().slice(0, 10),
    };
    vouchers.push(voucher);
  }
  console.log("Vouchers generated");
  return vouchers;
}

// Generate User Vouchers
function generateUserVouchers(count, users, vouchers) {
  let userVouchers = [];
  for (let i = 0; i < count; i++) {
    let userVoucher = {
      user_voucher_id: uuidv4(),
      user_id:
        users[faker.datatype.number({ min: 0, max: users.length - 1 })].us_id,
      voucher_id:
        vouchers[faker.datatype.number({ min: 0, max: vouchers.length - 1 })]
          .voucher_id,
      issue_date: faker.date.past().toISOString().slice(0, 10),
      used_date: faker.datatype.boolean()
        ? faker.date.recent().toISOString().slice(0, 10)
        : null,
    };
    userVouchers.push(userVoucher);
  }
  console.log("User Vouchers generated");
  return userVouchers;
}

// Function to generate SQL insert statements
function generateInsertStatements(tableName, data) {
  return data
    .map((row) => {
      const columns = Object.keys(row).join(", ");
      const values = Object.values(row)
        .map((value) =>
          typeof value === "string" && value.startsWith("\\x")
            ? value
            : value === null
            ? "NULL"
            : `'${value}'`
        )
        .join(", ");
      return `INSERT INTO ${tableName} (${columns}) VALUES (${values});`;
    })
    .join("\n");
}

// Write chunks of data to file
function writeDataInChunks(filename, tableName, data, chunkSize = 1000) {
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    const insertStatements = generateInsertStatements(tableName, chunk);
    fs.appendFileSync(filename, insertStatements + "\n\n");
  }
}

// Generate all data
const suppliers = generateSuppliers(10000);
const users = generateUsers(50000);
const payments = generatePayments(500000);
const shipments = generateShipments(500000);
const productCategories = generateProductCategories(100);
const products = generateProducts(200000, suppliers, productCategories);
const vouchers = generateVouchers(10000);
const userVouchers = generateUserVouchers(20000, users, vouchers);
const orders = generateOrders(500000, users, payments, shipments, vouchers);
const productsOrders = generateProductsOrders(500000, orders, products);
const productsReviews = generateProductsReviews(200000, products);

// Write insert statements to file in chunks
const filename = "seedresults.txt";
fs.writeFileSync(filename, ""); // Clear the file before writing
writeDataInChunks(filename, "suppliers", suppliers);
writeDataInChunks(filename, "users", users);
writeDataInChunks(filename, "payments", payments);
writeDataInChunks(filename, "shipments", shipments);
writeDataInChunks(filename, "products_categories", productCategories);
writeDataInChunks(filename, "products", products);
writeDataInChunks(filename, "vouchers", vouchers);
writeDataInChunks(filename, "user_vouchers", userVouchers);
writeDataInChunks(filename, "orders", orders);
writeDataInChunks(filename, "products_orders", productsOrders);
writeDataInChunks(filename, "products_reviews", productsReviews);

console.log("Insert statements written to seedresults.txt");
