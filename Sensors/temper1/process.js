var exec = require('child_process').exec;
var l = require('../../lib/log.js')
l.context = __filename

var interval = 5 * 1000
var previousStdout = ''

var pollSensor = function() {
  var cmd = '/usr/local/bin/node /root/Fido/Sensors/temper1/poll.js'
  exec(cmd, function(err, stdout, stderr) {
    if(stdout !== previousStdout) {
      l.g(stdout)
      previousStdout = stdout
    }
    if(stderr) l.g(stderr)
    if(err) l.g(err)
  })
}

setInterval(function() {
  pollSensor()
}, interval)

l.g('Timer set to poll at an interval of ' + interval)
console.log('forever::ready')

