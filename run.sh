node server.js &
sleep 5
chromium --kiosk http://localhost:8080 &
sleep 5
xdotool search --onlyvisible --class Chromium windowactivate
sudo python hover_passthrough.py
