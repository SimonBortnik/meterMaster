const {persist} = require("./storage.js");
const {persistBill} = require("./storageSQLite.js");

// ENUMs
const OP = {
    BILL : "bill",
    LOG_ERROR: "logError"
};

const NAME = {
    ACTION : "action",
    PRICE : "price"
};

// Handles a rulesObject returned from a scanner by analyzing the meta tags
function handleRules(rulesObject) {
    //For each rule do
    rulesObject.rules.forEach((rule) => {
        let metas = rule.metas;

        // Handle Billing
        if(metaQuery(NAME.ACTION, metas) == OP.BILL){
            persistBill(rule.id, metaQuery(NAME.PRICE, metas));
        }

        //Handle persisting
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