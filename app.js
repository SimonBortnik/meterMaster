const mqtt = require('mqtt')
const yara = require('yara')
const YAML = require('json2yaml')
const { handleRules } = require('./rulesHandler')

const MQT_PI = 'http://192.168.1.8:1883'
const CASE_HTTP_REQUEST = 'httpRequest'
const CASE_WEBSOCKET = 'websocket'

// Check if debug mode is activated
let debug = false
if (process.argv.length > 2) {
  debug = (process.argv.includes('-d') || process.argv.includes('--debug'))
}

//
// Yara
//

// Initialize scanner object
let scanner
yara.initialize((error) => {
  if (error) {
    console.error(error.message)
    process.exit(1)
  } else {
    const rules = [
      { filename: 'rules.yara' }
    ]
    scanner = yara.createScanner()
    scanner.configure({ rules: rules }, (error, warnings) => {
      if (error) {
        console.error('ERROR')
        if (error instanceof yara.CompileRulesError) {
          console.error(error.message + ': ' + JSON.stringify(error.errors))
        } else {
          console.error(error.message)
        }
        process.exit(1)
      } else {
        if (warnings.length) {
          console.warn('Compile warnings: ' + JSON.stringify(warnings) + '\n')
        }
      }
    })
  }
})

//
// Mosquitto
//

// Connection to message broker with "exactly once"-guarantee
const client = mqtt.connect(MQT_PI, { clientId: 'master' })
client.on('connect', () => {
  console.log('Metering Master connected')
  if (client.connected === true) {
    client.subscribe('httpRequest', { qos: 2 })
    client.subscribe('websocket', { qos: 2 })
  }
})
client.on('error', (error) => {
  console.error("Can't connect to MQTT: " + error)
  process.exit(1)
})

// Handling of received messages with distinction of cases
client.on('message', (topic, message, packet) => {
  let reqBufferObj

  // Case: HTTP request was intercepted
  if (topic === CASE_HTTP_REQUEST) {
    const reqString = message.toString()
    const reqYamlString = YAML.stringify(JSON.parse(reqString))
    reqBufferObj = { buffer: Buffer.from(reqYamlString) }
    if (debug) {
      console.log(reqYamlString)
    }
  }

  // Case: Websocket data was intercepted
  if (topic === CASE_WEBSOCKET) {
    reqBufferObj = { buffer: message }
    if (debug) {
      const reqString = message.toString()
      console.log(reqString)
    }
  }

  // Application of rules if reqBuffer is not undefined
  if (reqBufferObj !== undefined) {
    scanner.scan(reqBufferObj, (error, result) => {
      if (error) {
        console.error(error.message)
      } else {
        if (debug) {
          console.log(YAML.stringify(result))
        }
        handleRules(result, reqBufferObj.buffer)
      }
    })
  }
})
