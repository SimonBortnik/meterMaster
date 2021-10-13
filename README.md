# meterMaster
This is an analysis component which analyses the data provided by the [proxy component](https://github.com/SimonBortnik/meterProxy) via [Mosquitto](https://mosquitto.org/download/).
It applies the rules from the rules.yara to the received data stream to determine which functionalities were used in the proxied application in order to bill the usage.
## Requirements
Yara doesn't compile under Windows... This program should be run under Linux
## Installation
Set up a [Mosquitto](https://mosquitto.org/download/) instance. I recommend using their [docker image](https://hub.docker.com/_/eclipse-mosquitto) since it saves you the annoying setup.

Change the IP address to your Mosquitto instance in app.js.

```shell
$ npm install
$ node app.js
```
