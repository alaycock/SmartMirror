#  ===========================================================================
#  This is the library for Hover.
#
#  Hover is a development kit that lets you control your hardware projects in a whole new way.
#  Wave goodbye to physical buttons. Hover detects hand movements in the air for touch-less interaction.
#  It also features five touch-sensitive regions for even more options.
#  Hover uses I2C and 2 digital pins. It is compatible with Arduino, Raspberry Pi and more.
#
#  Hover can be purchased here: http://www.justhover.com
#
#  Written by Emran Mahbub and Jonathan Li for Gearseven Studios.
#  BSD license, all text above must be included in any redistribution
#  ===========================================================================
#  VERSIONS
#
#  v1.0 - original release
#  v1.1 - added automatic version check (17.12.14 by Aaron Shaw - shawaj)
#
#  ===========================================================================
#
#  INSTALLATION
#  Place the Hover_library.py file in the same folder as the Hover_example.py file.
#  Then run Hover_example.py by typing: sudo python Hover_example.py
#
#  SUPPORT
#  For questions and comments, email us at support@gearseven.com
#  ===========================================================================

import smbus
import time
import RPi.GPIO as GPIO

# Check for RPi Revision and decide I2C bus
if GPIO.RPI_REVISION == 1:
    bus = smbus.SMBus(0)
else:
    bus = smbus.SMBus(1)


dict = {'00100010': 'swipe_right', '00100100': 'swipe_left', '00101000': 'swipe_up', '00110000': 'swipe_down',
        '01001000': 'tap_east', '01000001': 'tap_south', '01000010': 'tap_west', '01000100': 'tap_north', '01010000': 'tap_center'}


class Hover(object):

    def __init__(self, address, ts, reset):
        print "Initializing Hover...please wait."
        self.address = address
        self.ts = ts
        self.reset = reset

        import RPi.GPIO as GPIO

        self.GPIO = GPIO
        self.GPIO.setmode(GPIO.BCM)
        self.GPIO.setup(self.ts, GPIO.IN)  # ts
        self.GPIO.setup(self.reset, GPIO.OUT)  # mclr
        self.GPIO.output(self.reset, False)

        time.sleep(5)

        self.GPIO.output(self.reset, True)
        self.GPIO.setup(self.reset, GPIO.IN)

        time.sleep(5)
        print "Hover is ready! To exit the program, hit Ctrl+C"

    def getStatus(self):

        if (self.GPIO.input(self.ts)):
            return 1
        else:
            self.GPIO.setup(self.ts, self.GPIO.OUT)  # ts
            self.GPIO.output(self.ts, self.GPIO.LOW)
            return 0

    def getEvent(self):

        busData = bus.read_i2c_block_data(self.address, 0, 18)

        gestureEvent = busData[10]
        touchEvent = (((busData[14] & 0b11100000) >> 5)
                      | ((busData[15] & 0b00000011) << 3))

        if gestureEvent > 1:
            event = "{:08b}".format((1 << (busData[10] - 1)) | 0b00100000)
            return event
        elif touchEvent > 0:
            event = "{:08b}".format(touchEvent | 0b01000000)
            return event

    def setRelease(self):

        self.GPIO.output(self.ts, self.GPIO.HIGH)
        self.GPIO.setup(self.ts, self.GPIO.IN)  # ts

    def end(self):

        self.GPIO.cleanup()

    def getEventString(self, event):
        if event in dict:
            return dict[event]
        else:
            return "Unknown"
