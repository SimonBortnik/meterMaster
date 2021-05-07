var mqtt = require('mqtt');
var yara = require("yara");
const {persist} = require("./storage.js");
var Flatted = require('flatted');

let MQT_PI = "http://192.168.1.200:1883"
let LOCAL_ADD = "http://localhost:1883/"

//
// Yara
//
let scanner;

yara.initialize(function(error) {
    if (error) {
        console.error(error.message)
    } else {
        var rules = [
            {filename: "rules.yara"}
        ]

        scanner = yara.createScanner()

        scanner.configure({rules: rules}, function(error, warnings) {
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
                } else {/*
                    var req = {buffer: Buffer.from("content")}

                    scanner.scan(req, function(error, result) {
                        if (error) {
                            console.error(error.message)
                        } else {
                            console.error(JSON.stringify(result))
                        }
                    }) */
                }
            }
        })
    }
})

//
// Mosquitto
//
// TODO: shared subscriptiion group --> no guarantee of QoS level 2

// Connection to message broker with "exactly once"-guarantee
var client = mqtt.connect(MQT_PI, {clientId: "master"});
client.on("connect", function () {
    console.log("Metering Master connected");
    if (client.connected == true) {
        client.subscribe("testtopic", {qos: 2});
    }
})
client.on("error", function (error) {
    console.log("Can't connect" + error)
});

// Handling of received messages
client.on('message', function (topic, message, packet) {
    //console.log("message is ",message);
    //console.log("topic is " + topic);
    var req = {buffer: Buffer.from(message)};
    let reqString = message.toString();
    let test = Flatted.parse(reqString);
    //console.log(test);
    //console.log(reqString);

    scanner.scan(req, function(error, result) {
        if (error) {
            console.error(error.message)
        } else {
            console.error(JSON.stringify(result))
        }
    })
});

