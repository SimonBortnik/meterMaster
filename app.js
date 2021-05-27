let mqtt = require('mqtt')
let yara = require("yara")
let YAML = require('json2yaml')
const {persist} = require("./storageSQLite.js")
const {test} = require("./storageSQLite.js")
const {handleRules} = require("./rulesHandler")

let MQT_PI = "http://192.168.1.200:1883"
let LOCAL_ADDR = "http://localhost:1883/"
let CASE_HTTP_REQUEST = "httpRequest"
let CASE_WEBSOCKET = "websocket"
let debug = false

// Check if debug mode is activated
if (process.argv.length > 2){
    debug = (process.argv.includes("-d") || process.argv.includes("--debug"))
}

//
// Yara
//
let scanner;

yara.initialize(function (error) {
    if (error) {
        console.error(error.message)
    } else {
        var rules = [
            {filename: "rules.yara"}
        ]

        scanner = yara.createScanner()

        scanner.configure({rules: rules}, function (error, warnings) {
            if (error) {
                console.log("ERROR")
                if (error instanceof yara.CompileRulesError) {
                    console.error(error.message + ": " + JSON.stringify(error.errors))
                } else {
                    console.error(error.message)
                }
            } else {
                if (warnings.length) {
                    console.error("Compile warnings: " + JSON.stringify(warnings))
                }
            }
        })
    }
})

//
// Mosquitto
//

// Connection to message broker with "exactly once"-guarantee
var client = mqtt.connect(MQT_PI, {clientId: "master"})
client.on("connect", function () {
    console.log("Metering Master connected")
    if (client.connected == true) {
        client.subscribe("httpRequest", {qos: 2})
        client.subscribe("websocket", {qos: 2})
    }
})
client.on("error", function (error) {
    console.log("Can't connect" + error)
});

// Handling of received messages with distinction of cases
client.on('message', function (topic, message, packet) {

    let reqBufferObj

    // Case: HTTP request was intercepted
    if (topic == CASE_HTTP_REQUEST) {
        let reqString = message.toString()
        let reqYamlString = YAML.stringify(JSON.parse(reqString))
        reqBufferObj= {buffer: Buffer.from(reqYamlString)}
        if (debug){
            console.log(reqYamlString)
        }
    }

    //  Case: Websocket data was intercepted
    if (topic == CASE_WEBSOCKET) {
        let test = message.toString()
        reqBufferObj = {buffer: message}
        if (debug){
            let reqString = message.toString();
            console.log(reqString)
        }

    }

    // Application of rules if reqBuffer is not undefined
    if (reqBufferObj !== undefined) {
        scanner.scan(reqBufferObj, function (error, result) {
            if (error) {
                console.error(error.message)
            } else {
                if (debug) {
                    console.log(YAML.stringify(result))
                }
                let test = reqBufferObj.buffer
                handleRules(result, reqBufferObj.buffer)
            }
        })
    }
});
