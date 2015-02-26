#!/usr/bin/env node

var program = require('commander')
program.allowUnknownOption(true)
var fs = require('fs')
var exec = require('child_process').exec

//console.log(process.argv)

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
  var child = exec('cd drivers; git clone ' + repoLocation)
  child.stdout.on('data', function(data) {
      console.log(data);
  })
  child.stderr.on('data', function(data) {
      console.log(data);
  })
  child.on('close', function(code) {
      //console.log('closing code: ' + code);
  })
}

var driver = function (driverName) {
  var args = process.argv
  args.shift()
  args.shift()
  args.shift()
  args.shift()
  var cmd = './drivers/' + driverName + '/' + args.join(' ')
  console.log('running: ' + cmd)
  var child = exec(cmd)
  child.stdout.on('data', function(data) {
    console.log(data);
  })
  child.stderr.on('data', function(data) {
    console.log(data);
  })
  child.on('close', function(code) {
    // console.log('done')
  })
}

var test = function() {

}

var hello = function () {
  console.log('Hello. I am thing.')
}

program
  .command('init')
  .action(init)

program
  .command('clone <repoLocation>')
  .action(clone)

program
  .command('driver <driverName>')
  .action(driver)

program
  .command('test')
  .action(test)

program
  .command('*')
  .action(hello)

program.parse(process.argv);
