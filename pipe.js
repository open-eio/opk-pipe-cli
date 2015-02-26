#!/usr/bin/env node

var program = require('commander');
var fs = require('fs')
var exec = require('child_process').exec;

var config = {}

var bootstrap = function(callback) {
  config = fs.readFile('config.json', {'encoding': 'utf8'}, function(err, data) {
    if (err) {
      console.log('No config.json found')
      config = false
      return callback()
    }
    config = JSON.parse(data)
    callback()
  })
}

var hello = function () {
  console.log('Hello. I am thing.')
}

var watch = function () {
  var interval = parseInt(config.interval)
  setInterval(function() {
    exec('pipe send `pipe poll`', function(err, stdout, stderr) {
    //exec('pipe poll', function(err, stdout, stderr) {
      if (err) console.log(err)
      if (stdout) console.log(stdout)
      if (stderr) console.log(stderr)
    })
  }, config.interval)
}

var log = function () {
  exec('./node_modules/' + config.thing + '/poll', function(err, stdout, stderr) {
    if (err) console.log(err)
    if (stdout) console.log(stdout)
    if (stderr) console.log(stderr)
  })
}

var send = function (message) {
  exec('./node_modules/' + config.reservoir + '/send "' + message + '"', function(err, stdout, stderr) {
    if (err) console.log(err)
    if (stdout) console.log(stdout)
    if (stderr) console.log(stderr)
  })
}

var poll = function () {
  exec('./node_modules/' + config.thing + '/poll', function(err, stdout, stderr) {
    if (err) console.log(err)
    if (stdout) console.log(stdout)
    if (stderr) console.log(stderr)
  })
}

var setReservoir = function (reservoirName) {
  console.log('setting default reservoir to %s', reservoirName);
  config.reservoir = reservoirName
  fs.writeFile('config.json', JSON.stringify(config), function(err) {
    if (err) return console.log(err)
    console.log('done')
  })
}

var setThing = function (thingName) {
  console.log('setting default thing to %s', thingName);
  config.thing = thingName
  fs.writeFile('config.json', JSON.stringify(config), function(err) {
    if (err) return console.log(err)
    console.log('done')
  })
}

var setWatchInterval = function (intervalLength) {
  console.log('setting interval to %s', intervalLength);
  config.interval = intervalLength
  fs.writeFile('config.json', JSON.stringify(config), function(err) {
    if (err) return console.log(err)
    console.log('done')
  })
}

var init = function () {
  bootstrap(function() {
    console.log('initializing your pipe')
    if (config !== false) {
      return console.log('Aborting. Found an active config.json file.')
    }
    var writeFile = function(callback) {
      fs.writeFile('config.json', '{}', function(err) {
        if (err) {
          console.log(err)
        }
        console.log('config.json written')
        callback()
      })
    }
    var makeDriversDirectory = function(callback) {
      exec('mkdir drivers', function (err) {
        if (err) console.log(err)
        console.log('created drivers directory')
        callback()
      })
    }
    // go
    writeFile(function() {
      makeDriversDirectory(function() {
        console.log('done')
      })
    })
  })
}

var clone = function (repoLocation) {
  eval('cd drivers; git clone ' + repoLocation, function(err) {
    if (err) console.log(err)
  })
}

program
  .command('clone <repoLocation>')
  .action(clone)

program
  .version('0.0.1')
  .command('thing <thingName>')
  .action(setThing)

program
  .version('0.0.1')
  .command('reservoir <reservoirName>')
  .action(setReservoir)

program
  .version('0.0.1')
  .command('interval <intervalLength>')
  .action(setWatchInterval)

program
  .command('init')
  .action(init)

program
  .command('watch')
  .action(watch)

program
  .command('poll')
  .action(poll)

program
  .version('0.0.1')
  .command('send <data>')
  .action(send)

program
  .command('*')
  .action(hello)

program.parse(process.argv);
