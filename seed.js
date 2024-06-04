const faker = require('faker');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

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

function generateInsertStatements(suppliers) {
    return suppliers.map(supplier => {
        return `INSERT INTO suppliers (sup_id, sup_name, sup_address, sup_contact) VALUES ('${supplier.sup_id}', '${supplier.sup_name}', '${supplier.sup_address}', '${supplier.sup_contact}');`;
    }).join('\n');
}

const suppliers = generateSuppliers(1000);
const insertStatements = generateInsertStatements(suppliers);

// Write the insert statements to a file
fs.writeFile('seedresults.txt', insertStatements, (err) => {
    if (err) {
        console.error('Error writing to file', err);
    } else {
        console.log('Insert statements written to seedresults.txt');
    }
});
