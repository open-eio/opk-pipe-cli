#!/usr/bin/env node

var program = require('commander')
program.allowUnknownOption(true)
var fs = require('fs')
var exec = require('child_process').exec
var config;

var bootstrap = function(callback) {
  fs.readFile('config.json', {'encoding': 'utf8'}, function(err, data) {
    if (err) {
      console.log('No config.json found.')
      config = false
      return callback()
    }
    config = JSON.parse(data)
    callback()
  })
}

var init = function () {
  bootstrap(function() {
    console.log('Initializing your pipe.')
    if (config !== false) {
      return console.log('Aborting. Found an active config.json file.')
    }
    var writeFile = function(callback) {
      fs.writeFile('config.json', '{}', function(err) {
        if (err) {
          console.log(err)
        }
        console.log('File config.json written.')
        callback()
      })
    }
    // go
    writeFile(function() {
      console.log('done')
    })
  })
}

var config = function(key, value) {
  bootstrap(function() {
    if (!key) return console.log(JSON.stringify(config, null, 2))
    var props = key.split('.')
    if (!config.hasOwnProperty(props[0])) {
      config[props[0]] = {}
    }
    config[props[0]][props[1]] = value
    fs.writeFile('config.json', JSON.stringify(config, null, 2), function(err) {
      if (err) return console.log(err)
      console.log('done')
    })
  })
}

var push = function(data) {
  bootstrap(function() {
    // @todo Check for dumn stuff
    var pushCmd = './' + config.pipe.push + '/push'
    for (key in config[config.pipe.push]) {
        pushCmd += ' --' + key + ' "' + config[config.pipe.push][key] + '"'
    }
    pushCmd += ' --data ' + data
    if (program.verbose) console.log("Running: " + pushCmd)
    var child = exec(pushCmd)
    child.stdout.on('data', function(data) {
      console.log(data);
    })
    child.stderr.on('data', function(data) {
      console.log(data);
    })
    child.on('close', function(code) {
      //console.log('closing code: ' + code);
    })
  })
}

var pull = function() {
  bootstrap(function() {
    // @todo Check for dumn stuff
    var pullCmd = './' + config.pipe.pull + '/pull'
    for (key in config[config.pipe.pull]) {
        pullCmd += ' --' + key + ' "' + config[config.pipe.pull][key] + '"'
    }
    if (program.verbose) console.log("Running: " + pullCmd)
    var child = exec(pullCmd)
    child.stdout.on('data', function(data) {
      console.log(data);
    })
    child.stderr.on('data', function(data) {
      console.log(data);
    })
    child.on('close', function(code) {
      //console.log('closing code: ' + code);
    })
  })
}

var pump = function() {
  bootstrap(function() {
    var child = exec('pipe push `pipe pull`')
    child.stdout.on('data', function(data) {
      console.log(data);
    })
    child.stderr.on('data', function(data) {
      console.log(data);
    })
    child.on('close', function(code) {
      if (config.hasOwnProperty('pump') && config.pump.hasOwnProperty('interval')) {
        console.log('Waiting ' + config.pump.interval + ' milliseconds.')
        setTimeout(pump, config.pump.interval)
      }
    })
  })
}

if (!process.argv[2]) {
  var child = exec('pipe --help')
  child.stdout.on('data', function(data) {
    console.log(data);
  })
}

program
  .command('init')
  .description('create a `config.json` file and a `drivers` folder in the directory you are in')
  .action(init)

program
  .command('config [key] [value]')
  .description('add or modify a value in the config.json file')
  .action(config)

program
  .command('push <data>')
  .description('Push data using a configured Pipe')
  .action(push)

program
  .command('pull')
  .option('--verbose')
  .description('Pull data using a configured Pipe')
  .action(pull)

program
  .command('pump [operation]')
  .description('configure the pump by setting the pump.interval value in config to your desired milliseconds and then use `pipe pump start`')
  .action(pump)

program
  .version('0.1.0')
  .option('--verbose')
  .parse(process.argv);
