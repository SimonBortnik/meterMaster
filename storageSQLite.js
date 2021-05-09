var sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./finally.sqlite');
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './finally.sqlite',
    logging: false
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

module.exports = {persistBill, getBills};