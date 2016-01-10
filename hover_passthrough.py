import time
import subprocess
from Hover_library import Hover

hover = Hover(address=0x42, ts=23, reset=24)

try:
    while True:

        # Check if hover is ready to send gesture or touch events
        if (hover.getStatus() == 0):

            # Read i2c data and print the type of gesture or touch event
            event = hover.getEvent()

            if event is not None:
                print event,
                # This line can be commented out if you don't want to see the
                # event in text format
                try:
                    direction = hover.getEventString(event)
                except:
                    print "Invalid input recieved from hover, ignoring."
                    direction = ''

                print direction

                if direction == 'swipe_left':
                    print 'left'
                    subprocess.Popen(['bash', '-c', 'xdotool key --window "$(xdotool search --class --onlyvisible Chromium | head -n 1)" Up'])
                elif direction == 'swipe_right':
                    print 'right'
                    subprocess.Popen(['bash', '-c', 'xdotool key --window "$(xdotool search --class --onlyvisible Chromium | head -n 1)" Down'])

            # Release the ts pin until Hover is ready to send the next event
            hover.setRelease()
        time.sleep(0.001)  # sleep for 1ms

except KeyboardInterrupt:
    print "Exiting..."
    hover.end()

# except:
#     print "Something has gone wrong...:("
#     hover.end()
