const faker = require("faker");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const bcrypt = require("bcrypt");

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
      us_rewards: faker.datatype.number({ min: 1, max: 5 }),
      us_role: faker.datatype.number({ min: 1, max: 1 }),
      us_birthday: faker.date
        .past(50, new Date("2000-01-01"))
        .toISOString()
        .slice(0, 10),
      us_password: bcrypt.hashSync(faker.internet.password(), 10),
      us_isLogin: faker.datatype.boolean(),
    };
    users.push(user);
  }
  return users;
}

function generateInsertStatements(tableName, data) {
  return data
    .map((row) => {
      const columns = Object.keys(row).join(", ");
      const values = Object.values(row)
        .map((value) =>
          typeof value === "string" && value.startsWith("\\x")
            ? value
            : `'${value}'`
        )
        .join(", ");
      return `INSERT INTO ${tableName} (${columns}) VALUES (${values});`;
    })
    .join("\n");
}

const batchSize = 10000;
const totalRecords = 1000000;
const fileName = "seedresults_users.txt";

fs.writeFileSync(fileName, "");

for (let i = 0; i < totalRecords; i += batchSize) {
  const users = generateUsers(batchSize);
  const insertStatements = generateInsertStatements("users", users);
  fs.appendFileSync(fileName, insertStatements + "\n\n");
  console.log(`Batch ${i / batchSize + 1} written to file`);
}
