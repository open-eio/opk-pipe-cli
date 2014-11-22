# GrovePi + Grove Temperature & Humidity Sensor Pro
# http://www.seeedstudio.com/wiki/Grove_-_Temperature_and_Humidity_Sensor_Pro

import grovepi

# Connect the Grove Temperature & Humidity Sensor Pro to digital port D4
# SIG,NC,VCC,GND
sensor = 4

try:
	[temp,humidity] = grovepi.dht(sensor,1)
	print "temp =", temp, " humidity =", humidity

	file = open("/srv/tmp/grove_dht", "w")

	file.write(str(temp))

	file.close()

except IOError:
	print "Error"
