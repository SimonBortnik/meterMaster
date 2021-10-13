const { persistBill, persistError } = require('./storageSQLite.js')

// ENUMs
const OP = {
  BILL: 'bill',
  LOG_ERROR: 'logError'
}

const NAME = {
  ACTION: 'action',
  PRICE: 'price',
  EXTRACT: 'extract'
}

// Handles a rulesObject returned from a scanner by analyzing the meta tags
const handleRules = (rulesObject, buffer) => {
  // For each rule do
  rulesObject.rules.forEach((rule) => {
    const metas = rule.metas

    // Handle Billing
    if (metaQuery(NAME.ACTION, metas) === OP.BILL) {
      // Extract information to database if needed
      let extractedInformation
      let rawExtract
      if ((rawExtract = metaQuery(NAME.EXTRACT, metas)) !== undefined) {
        let subtractStrings = []
        if (rawExtract.trim().length > 0) {
          subtractStrings = JSON.parse(rawExtract.replaceAll("'", '"'))
        }
        const from = rule.matches[0].offset
        const to = rule.matches[0].length + from
        extractedInformation = buffer.slice(from, to).toString()
        subtractStrings.forEach((subtractString) => {
          extractedInformation = extractedInformation.replace(subtractString, '')
        })
      }
      persistBill(rule.id, metaQuery(NAME.PRICE, metas), extractedInformation)
    }

    // Handle persisting errors
    if (metaQuery(NAME.ACTION, metas) === OP.LOG_ERROR) {
      persistError(rule.id, buffer.toString())
    }
  })
}

// Queries an array of meta tags for meta with matching id param
const metaQuery = (id, metas) => {
  let returnValue
  metas.forEach((meta) => {
    if (meta.id === id) {
      returnValue = meta.value
    }
  })
  return returnValue
}

module.exports = { handleRules }
