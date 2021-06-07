// const sqlite3 = require('sqlite3').verbose()
// const db = new sqlite3.Database('./finally.sqlite')
const { Sequelize } = require('sequelize')
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './meterMaster.sqlite',
  logging: false
})

const Bill = sequelize.define('bill', {
  // attributes
  ruleName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  price: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  extractedInformation: {
    type: Sequelize.STRING,
    allowNull: true
  }
}, {
  // options
})

const persistBill = (ruleName, price, extractedInformation) => {
  Bill.sync().then(() => {
    Bill.create({
      ruleName: ruleName,
      price: price,
      extractedInformation: extractedInformation
    })
  })
}

const Error = sequelize.define('error', {
  // attributes
  ruleName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  content: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  // options
})

const persistError = (ruleName, content) => {
  Error.sync().then(() => {
    Error.create({
      ruleName: ruleName,
      content: content
    })
  })
}

module.exports = { persistBill, persistError }
