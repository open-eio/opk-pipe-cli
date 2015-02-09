#!/usr/bin/env node

var program = require('commander');
var fs = require('fs')
var config = JSON.parse(fs.readFileSync('config.json', 'utf8'))
var exec = require('child_process').exec;

var hello = function () {
  console.log('Hello. I am thing.')
}

var log = function () {
  exec('./node_modules/' + config.sensor + '/poll', function(err, stdout, stderr) {
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
  exec('./node_modules/' + config.sensor + '/poll', function(err, stdout, stderr) {
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

var setSensor = function (sensorName) {
  console.log('setting default sensor to %s', sensorName);
  config.sensor = sensorName
  fs.writeFile('config.json', JSON.stringify(config), function(err) {
    if (err) return console.log(err)
    console.log('done')
  })
}

var init = function () {
  console.log('initializing your pipe')
  fs.writeFile('config.json', '{}', function(err) {
    if (err) {
      console.log(err)
    }
    console.log('config.json written')
  })
}

program
  .version('0.0.1')
  .command('sensor <sensorName>')
  .action(setSensor)

program
  .version('0.0.1')
  .command('reservoir <reservoirName>')
  .action(setReservoir)

program
  .command('init')
  .action(init)

program
  .command('poll')
  .action(poll)

program
  .version('0.0.1')
  .command('send <data>')
  .action(send)

program
  .version('0.0.1')
  .command('log')
  .action(send)

program
  .command('*')
  .action(hello)

program.parse(process.argv);
