var sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./finally.sqlite');
const { Sequelize } = require('sequelize');
//const sequelize = new Sequelize(':memory:');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './finally.sqlite',
});

const Bill = sequelize.define('bill', {
    // attributes
    ruleName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    price : {
        type: Sequelize.FLOAT,
        allowNull: false
    }
}, {
    // options
});

function persistBill(ruleName, price){
    Bill.create({
        ruleName: ruleName,
        price: price
    })
}

function getBills(){
    Bill.findAll().then(bills => {
        console.log("All bills:", JSON.stringify(bills, null, 4));
    });
}

async function persist(toBeSaved) {
    try {
        await Bill.sync({ force: false }).then(() => {
            // Now the `users` table in the database corresponds to the model definition
            return Bill.create({
                ruleName: 'test',
                price: '99'
            });
        });

        await Bill.findAll().then(users => {
            console.log("All users:", JSON.stringify(users, null, 4));
            Bill.sync({ force: true }).then(() => {});
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

}


//Sequelize & SQLite
module.exports = {persist, persistBill, getBills};