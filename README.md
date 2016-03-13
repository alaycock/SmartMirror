# SmartMirror
This is the Node.js server which displays a page you can put in your smart mirror. The web page can be controlled with the [Hover](http://hoverlabs.co/) gesture controller.

## Installation

### Raspberry Pi setup
To replicate my setup you'll need a Raspberry Pi with [Raspbian](https://www.raspberrypi.org/downloads/raspbian/) installed. Additionally you'll need Python 2.7, which is preinstalled with Raspbian, as well as Node.js for the web server. Install Chromium in order to view the web page which will display the mirror GUI.

### Web server setup
Run `npm install` to download the necessary dependencies, then run `gulp` to generate the web server files. To run the web server you can run `node server.js`.

### Hover event handler setup
You'll need to install `RPi.GPIO` and `smbus` dependencies if you don't already have them. You can run the event controller separately with `sudo python hover_passthrough.py`. This will send keystrokes `up` and `down` to any open Chromium browser, which are used to change the interface. 

### Running everything together
You can run `./run.sh` to run everything together, it will launch the Node.js server, Chromium and the Hover event handler. You can setup your Raspberry Pi to automatically run `run.sh` on startup to jump right into it.
