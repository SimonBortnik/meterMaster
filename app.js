var mqtt = require('mqtt');
const {persist} = require("./storage.js")

let MQT_PI = "http://172.17.0.3:1883"
let LOCAL_ADD = "http://localhost:1883/"

//
// Mosquitto
//

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
    //console.log("message is "+ message);
    console.log("topic is " + topic);
    let receivedData = JSON.parse(message);
    console.log(receivedData.host)
});

//
// Yara
//