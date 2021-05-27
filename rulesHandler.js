const {persist} = require("./storage.js");
const {persistBill} = require("./storageSQLite.js");

// ENUMs
const OP = {
    BILL : "bill",
    LOG_ERROR: "logError"
};

const NAME = {
    ACTION : "action",
    PRICE : "price",
    EXTRACT: "extract"
};

// Handles a rulesObject returned from a scanner by analyzing the meta tags
function handleRules(rulesObject, buffer) {
    //For each rule do
    rulesObject.rules.forEach((rule) => {
        let metas = rule.metas;

        // Handle Billing
        if(metaQuery(NAME.ACTION, metas) == OP.BILL){
            let extractedInformation
            if (metaQuery(NAME.EXTRACT, metas) !== undefined) {
                let rawExtract = metaQuery(NAME.EXTRACT, metas)
                let subtractStrings = []
                if (rawExtract.trim().length > 0){
                    subtractStrings = JSON.parse(rawExtract.replaceAll("'", "\""))
                }
                let from = rule.matches[0].offset
                let to = rule.matches[0].length + from
                extractedInformation = buffer.slice(from,to).toString()
                subtractStrings.forEach((subtractString) => {
                    extractedInformation = extractedInformation.replace(subtractString,"")
                })
            }
            persistBill(rule.id, metaQuery(NAME.PRICE, metas), extractedInformation);
        }

        // Handle persisting errors
        if(metaQuery(NAME.ACTION, metas) == OP.LOG_ERROR){
            persist("");
        }

    });
}

// Queries an array of meta tags for meta with matching id param
function metaQuery(id, metas){
    let returnValue;
    metas.forEach((meta) => {
        if(meta.id == id){
            returnValue = meta.value;
        }
    });
    return returnValue;
}

module.exports = {handleRules};