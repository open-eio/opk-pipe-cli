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

var config = function(key, value) {
  bootstrap(function() {
    var props = key.split('.')
    //console.log(config)
    if (!config.hasOwnProperty(props[0])) {
      config[props[0]] = {}
    }
    //console.log(config)
    if (props[1] && !config[props[0]].hasOwnProperty(props[1])) {
      config[props[0]][props[1]] = {}
    }
    //console.log(config)
    if (props[2] && !config[props[0]][props[1]].hasOwnProperty(props[2])) {
      config[props[0]][props[1]][props[2]] = {}
    }
    //console.log(config)
    eval('config.' + key + ' = ' + value)
    //console.log(config)
    fs.writeFile('config.json', JSON.stringify(config), function(err) {
      if (err) return console.log(err)
      console.log('done')
    })
  })

}

var pump = function(operation) {

}

var hello = function () {
  console.log('Hello. I am pipe. Type `pipe --help` to get more info.')
}

program
  .command('init')
  .description('create a `config.json` file and a `drivers` folder in the directory you are in')
  .action(init)

program
  .command('clone <repoLocation>')
  .description('clone a git repository into the drivers folder')
  .action(clone)

program
  .command('config <key> <value>')
  .description('add or modify a value in the config.json file')
  .action(config)

program
  .command('driver <driverName>')
  .description('shortcut command that translates to `./drivers/<driverName>/<command> [<option> <option> ...]`')
  .action(driver)

program
  .command('pump <operation>')
  .description('configure the pump by setting the pump.interval value in config to your desired milliseconds and then use `pipe pump start`')
  .action(pump)

program
  .command('*')
  .action(hello)

program.parse(process.argv);
