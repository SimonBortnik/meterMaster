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
// eslint-disable-next-line func-call-spacing
}) (async () => { await Bill.sync() })()

const persistBill = async (ruleName, price, extractedInformation) => {
  await Bill.create({
    ruleName,
    price,
    extractedInformation
  })
}

const persistError = async (ruleName, content) => {
  await Error.create({
    ruleName,
    content
  })
}
module.exports = { persistBill, persistError }
