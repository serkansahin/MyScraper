var appRoot = require('app-root-path')
var Winston = require('winston')

// Why Winston more than another? I used it in my previous job.
// Well the same code is available on Winston Github project in TL;DR examples.

var options = {
  file: {
    level: 'info',
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true
  }
}

var logger = new Winston.createLogger({
  transports: [
    new Winston.transports.File(options.file),
    new Winston.transports.Console(options.console)
  ],
  exitOnError: false // do not exit on handled exceptions
})

module.exports = logger
